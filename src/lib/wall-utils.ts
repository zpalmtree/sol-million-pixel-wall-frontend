import { Coordinate } from '@/types/coordinate';
import { Brick } from '@/types/brick';

export function getBrickFromPointerPosition(
    pointer: Coordinate,
    canvasWidth: number,
    canvasHeight: number,
    bricksPerRow: number,
    bricksPerColumn: number,
): Brick {
    const brickWidth = canvasWidth / bricksPerRow;
    const brickHeight = canvasHeight / bricksPerColumn;

    const x = Math.floor(pointer.x / brickWidth);
    const y = Math.floor(pointer.y / brickHeight);

    return {
        x,
        y,
        name: `${x},${y}`,
    };
}
