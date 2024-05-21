'use client';

import React, { useEffect, useRef } from 'react';
import {
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import {
    Canvas,
    Rect,
    Line,
    TPointerEvent,
    TPointerEventInfo,
    Point,
} from 'fabric';

import { Pixel } from '@/types/pixel';
import {
    calculateZoomLevel,
    calculateBrickCenter,
    zoomToCoordinate, 
    getBrickFromPointerPosition,
    getPixelFromPointerPosition,
    groupBricks,
    groupPixels,
    createRectanglesFromCluster,
    createRectanglesFromPixelCluster,
    getAllBricks,
} from '@/lib/wall-utils';
import {
    selectedBricksState,
    selectedBrickNamesSetState,
} from '@/state/bricks';
import {
    selectedPixelsState,
} from '@/state/pixels';
import { selectedColorState } from '@/state/color-picker';
import { addedImagesState } from '@/state/images';

import { uploadPreviewCanvasState } from '@/state/upload-preview';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';

export interface UploadPreviewProps {
    /* Width of canvas. Defaults to CANVAS_WIDTH. */
    width?: number;

    /* Height of canvas. Defaults to CANVAS_HEIGHT. */
    height?: number;
}

export function UploadPreview(props: UploadPreviewProps) {
    const {
        width,
        height,
    } = props;

    const selectedBricks = useRecoilValue(selectedBricksState);
    const selectedBricksSet = useRecoilValue(selectedBrickNamesSetState);
    const selectedColor = useRecoilValue(selectedColorState);
    const images = useRecoilValue(addedImagesState);

    const [ selectedPixels, setSelectedPixels ] = useRecoilState(selectedPixelsState);

    const [ canvas, setCanvas ] = useRecoilState(uploadPreviewCanvasState);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const [ selectedCanvasObjects, setSelectedCanvasObjects ] = React.useState<any[]>([]);
    
    const canvasWidth = React.useMemo(() => width || CANVAS_WIDTH, [ width ]);
    const canvasHeight = React.useMemo(() => height || CANVAS_HEIGHT, [ height ]);
    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [ canvasWidth ]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [ canvasHeight ]);

    const togglePixelColor = React.useCallback((pixel: Pixel) => {
        const newSelectedPixels = [];

        let found = false;

        for (const p of selectedPixels) {
            if (p.name === pixel.name) {
                found = true;

                /* Already this color, deselect */
                if (p.color === selectedColor) {
                    continue;
                /* Change color */
                } else {
                    newSelectedPixels.push({
                        ...p,
                        color: selectedColor,
                    });
                }
            } else {
                newSelectedPixels.push(p);
            }
        }

        if (!found) {
            newSelectedPixels.push({
                ...pixel,
                color: selectedColor,
            });
        }

        setSelectedPixels(newSelectedPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedColor,
        selectedPixels,
    ]);

const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
    if (!canvas) {
        return;
    }

    const pointer = canvas.getPointer(e.e);
    
    // Check if there is an image below the pointer
    const isImageBelowPointer = images.some(image => {
        const { left, top, width, height } = image.getBoundingRect();
        return pointer.x >= left && pointer.x <= left + width && pointer.y >= top && pointer.y <= top + height;
    });

    if (isImageBelowPointer) {
        console.log(`Image below pointer, not drawing pixel`);
        return;
    }

    const brick = getBrickFromPointerPosition(
        e.pointer,
        canvas,
        BRICKS_PER_ROW,
        BRICKS_PER_COLUMN,
    );

    if (!selectedBricksSet.has(brick.name)) {
        console.log(`Brick not selected, returning`);
        return;
    }

    const pixel = getPixelFromPointerPosition(
        e.pointer,
        canvas,
    );

    togglePixelColor(pixel);
}, [
    canvas,
    selectedBricksSet,
    togglePixelColor,
    images, // Add images to the dependency array
]);

/*
    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!canvas) {
            return;
        }

        const brick = getBrickFromPointerPosition(
            e.pointer,
            canvas,
            BRICKS_PER_ROW,
            BRICKS_PER_COLUMN,
        );

        if (!selectedBricksSet.has(brick.name)) {
            console.log(`Brick not selected, returning`);
            return;
        }

        const pixel = getPixelFromPointerPosition(
            e.pointer,
            canvas,
        );

        togglePixelColor(pixel);
    }, [
        canvas,
        selectedBricksSet,
        togglePixelColor,
    ]);
 */

    useEffect(() => {
        if (!canvas) {
            return;
        }

        const zoom = calculateZoomLevel(
            selectedBricks,
            canvasWidth,
            canvasHeight,
        );

        const center = calculateBrickCenter(
            selectedBricks,
            brickWidth,
            brickHeight,
        );

        console.log(`Zoom: ${zoom}, center: ${center.x}, ${center.y}`);

        if (zoom !== 1) {
            zoomToCoordinate(
                canvas,
                center,
                zoom,
            );
        } else {
            canvas.setZoom(1);
            canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        }
    }, [
        selectedBricks,
        canvasWidth,
        canvasHeight,
        canvas,
        brickHeight,
        brickWidth,
    ]);
    
    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas.on('mouse:up', handleMouseUp);

        canvas.on('mouse:wheel', function(opt) {
            const delta = opt.e.deltaY;
            let zoom = canvas.getZoom();

            zoom *= 0.999 ** delta;

            if (zoom > 30) {
                zoom = 30;
            }

            if (zoom < 1) {
                zoom = 1;
                canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
            }

            const point = new Point(opt.e.offsetX, opt.e.offsetY);

            canvas.zoomToPoint(point, zoom);

            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        return () => {
            canvas.off('mouse:up', handleMouseUp);
        }
    }, [
        canvas,
        handleMouseUp,
    ]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        // Remove existing rectangles
        for (const canvasObject of selectedCanvasObjects) {
            canvas.remove(canvasObject);
        }

        const newSelectedCanvasObjects: any[] = [];
        const visitedBricks = new Set<string>();
        const visitedPixels = new Set<string>();

        // Detect and merge overlapping bricks
        const brickClusters = groupBricks(selectedBricks, visitedBricks);

        // Create rectangles for each cluster of bricks
        for (const cluster of brickClusters) {
            const rectangles = createRectanglesFromCluster(cluster);

            for (const { minX, minY, maxX, maxY } of rectangles) {
                const rectangle = new Rect({
                    width: (maxX - minX + 1) * brickWidth,
                    height: (maxY - minY + 1) * brickHeight,
                    fill: '#C19A6B',
                    opacity: 0.3,
                    selectable: false,
                    evented: false,
                    left: minX * brickWidth,
                    top: minY * brickHeight,
                    strokeWidth: 0,
                });

                newSelectedCanvasObjects.push(rectangle);
                canvas.add(rectangle);
                canvas.sendObjectBackwards(rectangle);
            }
        }

        // Detect and merge overlapping pixels of the same color
        const pixelClusters = groupPixels(selectedPixels, visitedPixels);

        // Create rectangles for each cluster of pixels
        for (const cluster of pixelClusters) {
            const rectangles = createRectanglesFromPixelCluster(cluster);

            for (const { minX, minY, maxX, maxY, color } of rectangles) {
                const rectangle = new Rect({
                    width: (maxX - minX + 1),
                    height: (maxY - minY + 1),
                    fill: color,
                    opacity: 1,
                    selectable: false,
                    evented: false,
                    left: minX,
                    top: minY,
                    strokeWidth: 0,
                });

                newSelectedCanvasObjects.push(rectangle);
                canvas.add(rectangle);
                canvas.sendObjectBackwards(rectangle);
            }
        }

        // Get all bricks
        const allBricks = getAllBricks(canvas.width, canvas.height, brickWidth, brickHeight);

        const deselectedBricks = allBricks.filter(brick => !selectedBricksSet.has(brick.name));

        // Detect and merge overlapping deselected bricks
        const deselectedBrickClusters = groupBricks(deselectedBricks, new Set<string>());

        // Create rectangles for each cluster of deselected bricks
        for (const cluster of deselectedBrickClusters) {
            const rectangles = createRectanglesFromCluster(cluster);

            for (const { minX, minY, maxX, maxY } of rectangles) {
                const rectangle = new Rect({
                    width: (maxX - minX + 1) * brickWidth,
                    height: (maxY - minY + 1) * brickHeight,
                    fill: '#2f2f2f',
                    opacity: 0.9,
                    selectable: false,
                    evented: false,
                    left: minX * brickWidth,
                    top: minY * brickHeight,
                    strokeWidth: 0,
                });

                newSelectedCanvasObjects.push(rectangle);
                canvas.add(rectangle);
                canvas.bringObjectToFront(rectangle);
            }
        }

        setSelectedCanvasObjects(newSelectedCanvasObjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        canvas,
        selectedBricks,
        selectedPixels,
        selectedBricksSet,
        brickHeight,
        brickWidth,
    ]);

    useEffect(() => {
        const c = new Canvas(canvasRef.current!);

        setCanvas(c);

        c.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        c.backgroundColor = '#1A1A1A';

        c.defaultCursor = 'pointer';

        for (let i = 1; i < BRICKS_PER_ROW; i++) {
            const line = new Line([i * brickWidth, 0, i * brickWidth, canvasHeight], {
                evented: false,
                selectable: false,
                stroke: '#C19A6B',
                strokeWidth: 0.3,
                opacity: 0.3,
            });

            c.add(line);
            c.sendObjectToBack(line);
        }

        for (let i = 1; i < BRICKS_PER_COLUMN; i++) {
            const line = new Line([0, i * brickHeight, canvasWidth, i * brickHeight], {
                evented: false,
                selectable: false,
                stroke: '#C19A6B',
                strokeWidth: 0.3,
                opacity: 0.3,
            });

            c.add(line);
            c.sendObjectToBack(line);
        }

        // Clean up on component unmount
        return () => {
            c.dispose();
        };
    }, [
        canvasHeight,
        canvasWidth,
        brickHeight,
        brickWidth,
        setCanvas,
    ]);

    // Canvas style can be adjusted via css or inline style
    return (
        <canvas
            ref={canvasRef}
            style={{
                width: canvasWidth,
                height: canvasHeight,
            }}
        />
    );
}
