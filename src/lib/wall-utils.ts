import { Coordinate } from '@/types/coordinate';
import { Brick } from '@/types/brick';
import { Pixel } from '@/types/pixel';
import { StaticCanvas, Canvas } from 'fabric';
import {
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';

export function getBrickFromPointerPosition(
    pointer: Coordinate,
    canvas: Canvas | StaticCanvas,
    bricksPerRow: number,
    bricksPerColumn: number,
): Brick {
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Clamp the pointer position to ensure it is within the canvas boundaries
    const clampedPointerPosition = {
        x: clamp(pointer.x, 0, canvasWidth - 1),
        y: clamp(pointer.y, 0, canvasHeight - 1),
    };

    const zoom = canvas.getZoom();
    const panX = canvas.viewportTransform[4];
    const panY = canvas.viewportTransform[5];

    // Correct the pointer coordinates for zoom and pan
    const transformedPointerX = (clampedPointerPosition.x - panX) / zoom;
    const transformedPointerY = (clampedPointerPosition.y - panY) / zoom;

    const brickWidth = canvasWidth / bricksPerRow;
    const brickHeight = canvasHeight / bricksPerColumn;

    const x = Math.floor(transformedPointerX / brickWidth);
    const y = Math.floor(transformedPointerY / brickHeight);

    return {
        x,
        y,
        name: `${x},${y}`,
    };
}

export function getPixelFromPointerPosition(
    pointer: Coordinate,
    canvas: Canvas | StaticCanvas
): Pixel {
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // Clamp the pointer position to ensure it is within the canvas boundaries
    const clampedPointerPosition = {
        x: clamp(pointer.x, 0, canvasWidth - 1),
        y: clamp(pointer.y, 0, canvasHeight - 1),
    };

    const zoom = canvas.getZoom();
    const panX = canvas.viewportTransform[4];
    const panY = canvas.viewportTransform[5];

    // Correct the pointer coordinates for zoom and pan
    const transformedPointerX = (clampedPointerPosition.x - panX) / zoom;
    const transformedPointerY = (clampedPointerPosition.y - panY) / zoom;

    // Since each pixel is 1x1, the pixel coordinates are the same as the transformed pointer coordinates
    const x = Math.floor(transformedPointerX);
    const y = Math.floor(transformedPointerY);

    return {
        x,
        y,
        name: `${x},${y}`,
        color: '#000000',
    };
}

export function calculateZoomLevel(
    selectedBricks: Brick[], 
    canvasWidth: number, 
    canvasHeight: number, 
): number {
    if (selectedBricks.length === 0) {
        return 1; // No zoom if no bricks are selected
    }

    // Determine bounding box of the selected bricks
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    selectedBricks.forEach(brick => {
        if (brick.x < minX) minX = brick.x;
        if (brick.x > maxX) maxX = brick.x;
        if (brick.y < minY) minY = brick.y;
        if (brick.y > maxY) maxY = brick.y;
    });

    // Calculate width and height of the bounding box
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    // Add 30% extra space around the bounding box
    const paddedWidth = width * 1.3;
    const paddedHeight = height * 1.3;

    // Calculate zoom level based on the canvas size
    const zoomLevelX = canvasWidth / (paddedWidth * canvasWidth / BRICKS_PER_ROW);
    const zoomLevelY = canvasHeight / (paddedHeight * canvasHeight / BRICKS_PER_COLUMN);

    let zoom = Math.min(zoomLevelX, zoomLevelY);

    if (zoom > 30) {
        zoom = 30;
    }

    if (zoom < 1) {
        zoom = 1;
    }

    return zoom;
}

export function calculateBrickCenter(
    selectedBricks: Brick[],
    brickWidth: number,
    brickHeight: number,
): Coordinate {
    if (selectedBricks.length === 0) {
        return {
            x: 0,
            y: 0,
        };
    }

    // Determine bounding box of the selected bricks
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    selectedBricks.forEach(brick => {
        if (brick.x < minX) minX = brick.x;
        if (brick.x > maxX) maxX = brick.x;
        if (brick.y < minY) minY = brick.y;
        if (brick.y > maxY) maxY = brick.y;
    });

    // Calculate the center coordinates
    const gridCenterX = (minX + maxX) / 2;
    const gridCenterY = (minY + maxY) / 2;

    // Convert grid center to canvas coordinates
    const canvasCenterX = (gridCenterX + 0.5) * brickWidth; // Add 0.5 to center the brick
    const canvasCenterY = (gridCenterY + 0.5) * brickHeight; // Add 0.5 to center the brick

    return {
        x: canvasCenterX,
        y: canvasCenterY,
    };
}

export function zoomToCoordinate(
    canvas: Canvas,
    coord: Coordinate,
    zoom: number,
): void {  
    // Set initial zoom level
    canvas.setZoom(zoom);

    const { x, y } = coord;

    // Find canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Convert point to canvas coordinates considering zoom
    const newCenterX = (x * zoom) - centerX;
    const newCenterY = (y * zoom) - centerY;

    // Note the negative to move the viewport correctly
    canvas.viewportTransform![4] = -newCenterX;
    canvas.viewportTransform![5] = -newCenterY;
}

export function dfsBricks(
    x: number,
    y: number,
    bricks: Brick[],
    cluster: Brick[],
    visitedBricks: Set<string>
) {
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const stack = [[x, y]];

    while (stack.length) {
        const [cx, cy] = stack.pop()!;
        const key = `${cx},${cy}`;

        if (visitedBricks.has(key)) {
            continue;
        }

        visitedBricks.add(key);

        cluster.push({ x: cx, y: cy, name: `${cx},${cy}` });

        for (const [dx, dy] of directions) {
            const nx = cx + dx, ny = cy + dy;
            if (bricks.some((b: Brick) => b.x === nx && b.y === ny) && !visitedBricks.has(`${nx},${ny}`)) {
                stack.push([nx, ny]);
            }
        }
    }
}

export function dfsPixels(
    x: number,
    y: number,
    color: string,
    pixels: Pixel[],
    cluster: Pixel[],
    visitedPixels: Set<string>
) {
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const stack = [[x, y]];

    while (stack.length) {
        const [cx, cy] = stack.pop()!;
        const key = `${cx},${cy}`;

        if (visitedPixels.has(key)) {
            continue;
        }

        visitedPixels.add(key);

        cluster.push({ x: cx, y: cy, color, name: `${cx},${cy}` });

        for (const [dx, dy] of directions) {
            const nx = cx + dx, ny = cy + dy;
            if (pixels.some((p: Pixel) => p.x === nx && p.y === ny && p.color === color) && !visitedPixels.has(`${nx},${ny}`)) {
                stack.push([nx, ny]);
            }
        }
    }
}

export function groupBricks(
    bricks: Brick[],
    visitedBricks: Set<string>
): Brick[][] {
    const clusters: Brick[][] = [];

    for (const brick of bricks) {
        const key = `${brick.x},${brick.y}`;

        if (!visitedBricks.has(key)) {
            const cluster: Brick[] = [];
            dfsBricks(brick.x, brick.y, bricks, cluster, visitedBricks);
            clusters.push(cluster);
        }
    }

    return clusters;
}

export function groupPixels (
    pixels: Pixel[],
    visitedPixels: Set<string>,
): Pixel[][] {
    const clusters: Pixel[][] = [];

    for (const pixel of pixels) {
        const key = `${pixel.x},${pixel.y}`;

        if (!visitedPixels.has(key)) {
            const cluster: Pixel[] = [];
            dfsPixels(pixel.x, pixel.y, pixel.color, pixels, cluster, visitedPixels);
            clusters.push(cluster);
        }
    }

    return clusters;
}

export function createRectanglesFromCluster(
    cluster: Brick[]
) {
    const bricksSet: Set<string> = new Set(cluster.map(brick => `${brick.x},${brick.y}`));
    const rectangles: { minX: number; minY: number; maxX: number; maxY: number; }[] = [];

    while (bricksSet.size > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const queue = [Array.from(bricksSet)[0].split(',').map(Number)];
        const currentCluster: Brick[] = [];

        while (queue.length > 0) {
            const [cx, cy] = queue.shift()!;
            const key = `${cx},${cy}`;

            if (!bricksSet.has(key)) {
                continue;
            }

            bricksSet.delete(key);
            currentCluster.push({ x: cx, y: cy, name: `${cx},${cy}` });

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
}

export function createRectanglesFromPixelCluster(
    cluster: Pixel[]
) {
    const pixelsSet: Set<string> = new Set(cluster.map(pixel => `${pixel.x},${pixel.y}`));
    const rectangles: { minX: number; minY: number; maxX: number; maxY: number; color: string }[] = [];

    while (pixelsSet.size > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const queue = [Array.from(pixelsSet)[0].split(',').map(Number)];
        const currentCluster: Pixel[] = [];

        while (queue.length > 0) {
            const [cx, cy] = queue.shift()!;
            const key = `${cx},${cy}`;

            if (!pixelsSet.has(key)) {
                continue;
            }

            pixelsSet.delete(key);
            currentCluster.push({ x: cx, y: cy, color: cluster[0].color, name: `${cx},${cy}` });

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
}
