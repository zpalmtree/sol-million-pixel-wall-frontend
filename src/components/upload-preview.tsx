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

import { Brick } from '@/types/brick';
import { Pixel } from '@/types/pixel';
import {
    calculateZoomLevel,
    calculateBrickCenter,
    zoomToCoordinate,
    getBrickFromPointerPosition,
    getPixelFromPointerPosition,
} from '@/lib/wall-utils';
import {
    selectedBricksState,
    selectedBrickNamesSetState,
} from '@/state/bricks';
import {
    selectedPixelsState,
} from '@/state/pixels';
import { selectedColorState } from '@/state/color-picker';

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

        console.log(pixel);

        togglePixelColor(pixel);
    }, [
        canvas,
        selectedBricksSet,
        togglePixelColor,
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

        // Function to perform a DFS to find all connected bricks
        const dfsBricks = (x: number, y: number, bricks: Brick[], cluster: Brick[]) => {
            const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            const stack = [[x, y]];

            while (stack.length) {
                const [cx, cy] = stack.pop()!;
                const key = `${cx},${cy}`;

                if (visitedBricks.has(key)) {
                    continue;
                }

                visitedBricks.add(key);

                cluster.push({
                    x: cx,
                    y: cy,
                    name: `${cx},${cy}`,
                });

                for (const [dx, dy] of directions) {
                    const nx = cx + dx, ny = cy + dy;
                    if (bricks.some((b: Brick) => b.x === nx && b.y === ny) && !visitedBricks.has(`${nx},${ny}`)) {
                        stack.push([nx, ny]);
                    }
                }
            }
        };

        // Function to perform a DFS to find all connected pixels of the same color
        const dfsPixels = (x: number, y: number, color: string, pixels: Pixel[], cluster: Pixel[]) => {
            const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            const stack = [[x, y]];

            while (stack.length) {
                const [cx, cy] = stack.pop()!;
                const key = `${cx},${cy}`;

                if (visitedPixels.has(key)) {
                    continue;
                }

                visitedPixels.add(key);

                cluster.push({
                    x: cx,
                    y: cy,
                    color: color,
                    name: `${cx},${cy}`,
                });

                for (const [dx, dy] of directions) {
                    const nx = cx + dx, ny = cy + dy;
                    if (pixels.some((p: Pixel) => p.x === nx && p.y === ny && p.color === color) && !visitedPixels.has(`${nx},${ny}`)) {
                        stack.push([nx, ny]);
                    }
                }
            }
        };

        // Function to group bricks into clusters
        const groupBricks = (bricks: Brick[]) => {
            const clusters: Brick[][] = [];

            for (const brick of bricks) {
                const key = `${brick.x},${brick.y}`;
                if (!visitedBricks.has(key)) {
                    const cluster: Brick[] = [];
                    dfsBricks(brick.x, brick.y, bricks, cluster);
                    clusters.push(cluster);
                }
            }
            return clusters;
        };

        // Function to group pixels into clusters of the same color
        const groupPixels = (pixels: Pixel[]) => {
            const clusters: Pixel[][] = [];

            for (const pixel of pixels) {
                const key = `${pixel.x},${pixel.y}`;
                if (!visitedPixels.has(key)) {
                    const cluster: Pixel[] = [];
                    dfsPixels(pixel.x, pixel.y, pixel.color, pixels, cluster);
                    clusters.push(cluster);
                }
            }
            return clusters;
        };

        // Function to create rectangles from a cluster of bricks
        const createRectanglesFromCluster = (cluster: Brick[]) => {
            const bricksSet: Set<string> = new Set(cluster.map(brick => `${brick.x},${brick.y}`));
            const rectangles = [];

            while (bricksSet.size > 0) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                const queue = [Array.from(bricksSet)[0].split(',').map(Number)];
                const currentCluster = [];

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift()!;
                    const key = `${cx},${cy}`;

                    if (!bricksSet.has(key)) {
                        continue;
                    }

                    bricksSet.delete(key);
                    currentCluster.push({ x: cx, y: cy });

                    minX = Math.min(minX, cx);
                    minY = Math.min(minY, cy);
                    maxX = Math.max(maxX, cx);
                    maxY = Math.max(maxY, cy);

                    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([dx, dy]) => {
                        const nx = cx + dx, ny = cy + dy;
                        if (bricksSet.has(`${nx},${ny}`)) {
                            queue.push([nx, ny]);
                        }
                    });
                }

                const grid = Array.from({ length: maxY - minY + 1 }, () =>
                    Array.from({ length: maxX - minX + 1 }, () => false)
                );

                currentCluster.forEach(({ x, y }) => {
                    grid[y - minY][x - minX] = true;
                });

                for (let i = 0; i < grid.length; i++) {
                    for (let j = 0; j < grid[i].length; j++) {
                        if (grid[i][j]) {
                            let width = 1, height = 1;

                            while (j + width < grid[i].length && grid[i][j + width]) {
                                width++;
                            }

                            while (i + height < grid.length && grid[i + height].slice(j, j + width).every(v => v)) {
                                height++;
                            }

                            for (let y = 0; y < height; y++) {
                                for (let x = 0; x < width; x++) {
                                    grid[i + y][j + x] = false;
                                }
                            }

                            rectangles.push({
                                minX: j + minX,
                                minY: i + minY,
                                maxX: j + minX + width - 1,
                                maxY: i + minY + height - 1
                            });
                        }
                    }
                }
            }

            return rectangles;
        };

        // Function to create rectangles from a cluster of pixels
        const createRectanglesFromPixelCluster = (cluster: Pixel[]) => {
            const pixelsSet: Set<string> = new Set(cluster.map(pixel => `${pixel.x},${pixel.y}`));
            const rectangles = [];

            while (pixelsSet.size > 0) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                const queue = [Array.from(pixelsSet)[0].split(',').map(Number)];
                const currentCluster = [];

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift()!;
                    const key = `${cx},${cy}`;

                    if (!pixelsSet.has(key)) {
                        continue;
                    }

                    pixelsSet.delete(key);
                    currentCluster.push({ x: cx, y: cy, color: cluster[0].color });

                    minX = Math.min(minX, cx);
                    minY = Math.min(minY, cy);
                    maxX = Math.max(maxX, cx);
                    maxY = Math.max(maxY, cy);

                    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([dx, dy]) => {
                        const nx = cx + dx, ny = cy + dy;
                        if (pixelsSet.has(`${nx},${ny}`)) {
                            queue.push([nx, ny]);
                        }
                    });
                }

                const grid = Array.from({ length: maxY - minY + 1 }, () =>
                    Array.from({ length: maxX - minX + 1 }, () => false)
                );

                currentCluster.forEach(({ x, y }) => {
                    grid[y - minY][x - minX] = true;
                });

                for (let i = 0; i < grid.length; i++) {
                    for (let j = 0; j < grid[i].length; j++) {
                        if (grid[i][j]) {
                            let width = 1, height = 1;

                            while (j + width < grid[i].length && grid[i][j + width]) {
                                width++;
                            }

                            while (i + height < grid.length && grid[i + height].slice(j, j + width).every(v => v)) {
                                height++;
                            }

                            for (let y = 0; y < height; y++) {
                                for (let x = 0; x < width; x++) {
                                    grid[i + y][j + x] = false;
                                }
                            }

                            rectangles.push({
                                minX: j + minX,
                                minY: i + minY,
                                maxX: j + minX + width - 1,
                                maxY: i + minY + height - 1,
                                color: cluster[0].color,
                            });
                        }
                    }
                }
            }

            return rectangles;
        };

        // Reset visited sets before processing selected bricks and pixels
        visitedBricks.clear();
        visitedPixels.clear();

        // Detect and merge overlapping bricks
        const brickClusters = groupBricks(selectedBricks);

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
            }
        }

        // Detect and merge overlapping pixels of the same color
        const pixelClusters = groupPixels(selectedPixels);

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
            }
        }

        setSelectedCanvasObjects(newSelectedCanvasObjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        canvas,
        selectedBricks,
        selectedPixels,
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
