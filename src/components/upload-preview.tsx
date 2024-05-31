'use client';

import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';
import {
    Canvas,
    Rect,
    Line,
    TPointerEvent,
    TPointerEventInfo,
    Point,
    Image,
} from 'fabric';

import { Pixel } from '@/types/pixel';
import { Brick } from '@/types/brick';
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
    getWallInfo,
} from '@/lib/wall-utils';
import {
    selectedBricksState,
    selectedBrickNamesSetState,
    startingBricksState,
} from '@/state/bricks';
import {
    selectedPixelsState,
} from '@/state/pixels';
import { selectedColorState } from '@/state/color-picker';
import {
    addedImagesState,
    startingPixelWallImageState,
} from '@/state/images';

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

    visible: boolean;

    selectedBricks: Brick[];

    selectedBricksSet: Set<string>;
}

export function UploadPreview(props: UploadPreviewProps) {
    const {
        width,
        height,
        visible = true,
        selectedBricks,
        selectedBricksSet,
    } = props;

    const selectedColor = useRecoilValue(selectedColorState);
    const images = useRecoilValue(addedImagesState);
    const setStartingBricks = useSetRecoilState(startingBricksState);

    const [ selectedPixels, setSelectedPixels ] = useRecoilState(selectedPixelsState);
    const [ startingPixelWallImage, setStartingPixelWallImage ] = useRecoilState(startingPixelWallImageState);

    const [ canvas, setCanvas ] = useRecoilState(uploadPreviewCanvasState);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const [ itemsOnCanvas, setItemsOnCanvas ] = React.useState<any[]>([]);
    
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

    const loadInitialInfo = React.useCallback(async () => {
        console.log('Loading initial info');

        if (startingPixelWallImage) {
            return;
        }

        const { image, bricks, error } = await getWallInfo();

        if (error) {
            toast.warn(`Failed to load wall info: ${error}`);
            return;
        }

        setStartingPixelWallImage(image);
        setStartingBricks(bricks);

    }, [
        startingPixelWallImage,
        setStartingPixelWallImage,
        setStartingBricks,
    ]);

    const drawCanvas = React.useCallback(async () => {
        if (!canvas) {
            return;
        }

        for (const image of images) {
            canvas.remove(image);
        }

        // Remove existing rectangles
        for (const canvasObject of itemsOnCanvas) {
            canvas.remove(canvasObject);
        }

        const newItemsOnCanvas: any[] = [];

        const visitedBricks = new Set<string>();
        const visitedPixels = new Set<string>();

        // Detect and merge overlapping bricks
        const brickClusters = groupBricks(selectedBricks, visitedBricks);

        // Detect and merge overlapping pixels of the same color
        const pixelClusters = groupPixels(selectedPixels, visitedPixels);

        /* STEP 1: Draw background image */
        if (startingPixelWallImage) {
            const backgroundImage = await Image.fromURL(startingPixelWallImage);

            backgroundImage.scaleToWidth(canvasWidth);
            backgroundImage.scaleToHeight(canvasHeight);
            backgroundImage.selectable = false;
            backgroundImage.evented = false;

            newItemsOnCanvas.push(backgroundImage);
            canvas.add(backgroundImage);
        }

        /* STEP 2: Draw grid lines */
        for (let i = 1; i < BRICKS_PER_ROW; i++) {
            const line = new Line([i * brickWidth, 0, i * brickWidth, canvasHeight], {
                evented: false,
                selectable: false,
                stroke: '#C19A6B',
                strokeWidth: 0.1,
                opacity: 0.3,
            });

            newItemsOnCanvas.push(line);
            canvas.add(line);
        }

        for (let i = 1; i < BRICKS_PER_COLUMN; i++) {
            const line = new Line([0, i * brickHeight, canvasWidth, i * brickHeight], {
                evented: false,
                selectable: false,
                stroke: '#C19A6B',
                strokeWidth: 0.1,
                opacity: 0.3,
            });

            newItemsOnCanvas.push(line);
            canvas.add(line);
        }
        
        /* Step 3: Draw selected bricks */
        for (const cluster of brickClusters) {
            const rectangles = createRectanglesFromCluster(cluster);

            for (const { minX, minY, maxX, maxY } of rectangles) {
                const rectangle = new Rect({
                    width: ((maxX - minX + 1) * brickWidth) + 0.03,
                    height: ((maxY - minY + 1) * brickHeight) + 0.03,
                    fill: '#4C4032',
                    opacity: 1,
                    selectable: false,
                    evented: false,
                    left: minX * brickWidth,
                    top: minY * brickHeight,
                    strokeWidth: 0,
                    hasBorders: false,
                });

                newItemsOnCanvas.push(rectangle);
                canvas.add(rectangle);
            }
        }

        // Create rectangles for each cluster of pixels
        /* Step 4: Draw drawn pixels */
        for (const cluster of pixelClusters) {
            const rectangles = createRectanglesFromPixelCluster(cluster);

            for (const { minX, minY, maxX, maxY, color } of rectangles) {
                const rectangle = new Rect({
                    width: (maxX - minX + 1) + 0.03,
                    height: (maxY - minY + 1) + 0.03,
                    fill: color,
                    opacity: 1,
                    selectable: false,
                    evented: false,
                    left: minX,
                    top: minY,
                    strokeWidth: 0,
                    hasBorders: false,
                });

                newItemsOnCanvas.push(rectangle);
                canvas.add(rectangle);
            }
        }

        /* Step 5: Draw images */
        for (const image of images) {
            canvas.add(image);
            canvas.bringObjectToFront(image);
        }

        setItemsOnCanvas(newItemsOnCanvas);
    }, [
        canvas,
        selectedBricks,
        selectedPixels,
        selectedBricksSet,
        brickHeight,
        brickWidth,
        images,
        startingPixelWallImage,
        canvasHeight,
        canvasWidth,
    ]);
    
    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!canvas) {
            return;
        }

        const pointer = canvas.getPointer(e.e);

        // Check if there is an active object being manipulated
        const activeObject = canvas.getActiveObject();

        if (activeObject) {
            console.log(`Object is being manipulated, not drawing pixel`);
            return;
        }

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
        images,
    ]);

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

            if (zoom > 40) {
                zoom = 40;
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
        drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        canvas,
        selectedBricks,
        selectedPixels,
        selectedBricksSet,
        brickHeight,
        brickWidth,
        images,
        startingPixelWallImage,
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

    useEffect(() => {
        loadInitialInfo();
    }, [
        loadInitialInfo,
    ]);

    // Canvas style can be adjusted via css or inline style
    return (
        <canvas
            ref={canvasRef}
            style={{
                width: canvasWidth,
                height: canvasHeight,
                display: visible ? 'block' : 'none',
            }}
        />
    );
}
