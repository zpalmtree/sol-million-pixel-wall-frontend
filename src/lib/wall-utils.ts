import { Coordinate } from '@/types/coordinate';
import { Brick } from '@/types/brick';
import { Canvas } from 'fabric';
import {
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';

export function getBrickFromPointerPosition(
    pointer: Coordinate,
    canvas: Canvas,
    bricksPerRow: number,
    bricksPerColumn: number,
): Brick {
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    
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

    if (zoom > 10) {
        zoom = 10;
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
