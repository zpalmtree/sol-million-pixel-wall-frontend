'use client';

import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import {
    Canvas,
    StaticCanvas,
    Rect,
    Line,
    TPointerEvent,
    TPointerEventInfo,
} from 'fabric';

import { Coordinate } from '@/types/coordinate';
import { Brick } from '@/types/brick';
import {
    getBrickFromPointerPosition,
    groupBricks,
    createRectanglesFromCluster,
} from '@/lib/wall-utils';
import { selectedBricksState } from '@/state/bricks';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';

export interface PixelWallProps {
    /* Width of canvas. Defaults to CANVAS_WIDTH. */
    width?: number;

    /* Height of canvas. Defaults to CANVAS_HEIGHT. */
    height?: number;

    /* Whether the user can interactive with the canvas. Defaults to false */
    interactable?: boolean;

    /* Whether we should draw the 'block' lines. Defaults to true */
    displayGridLines?: boolean;
}


export function PixelWall(props: PixelWallProps) {
    const {
        width,
        height,
        interactable = false,
        displayGridLines = true,
    } = props;

    const canvasWidth = React.useMemo(() => width || CANVAS_WIDTH, [ width ]);
    const canvasHeight = React.useMemo(() => height || CANVAS_HEIGHT, [ height ]);

    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [ canvasWidth ]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [ canvasHeight ]);

    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const [ canvas, setCanvas ] = React.useState<Canvas | StaticCanvas | undefined>();
    const [ lastPointerPosition, setLastPointerPosition ] = React.useState<Coordinate | undefined>();
    const [ selectedCanvasObjects, setSelectedCanvasObjects ] = React.useState<any[]>([]);

    const [ selectedBricks, setSelectedBricks ] = useRecoilState(selectedBricksState);

    const handleMouseDown = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        setLastPointerPosition(e.pointer);
    }, [
        setLastPointerPosition,
    ]);

    const toggleBrickSelectedState = React.useCallback((brick: Brick) => {
        const newSelectedBricks = [];

        let found = false;

        for (const b of selectedBricks) {
            if (b.name === brick.name) {
                found = true;
                continue;
            }

            newSelectedBricks.push(b);
        }

        if (!found) {
            newSelectedBricks.push(brick);
        }

        setSelectedBricks(newSelectedBricks);
    }, [
        selectedBricks,
        setSelectedBricks,
    ]);

    const selectBrickRange = React.useCallback((startBrick: Brick, endBrick: Brick) => {
        // Create a new set for selected bricks
        const newSelectedBricks = [];

        // Calculate the min/max for x and y
        const minX = Math.min(startBrick.x, endBrick.x);
        const maxX = Math.max(startBrick.x, endBrick.x);
        const minY = Math.min(startBrick.y, endBrick.y);
        const maxY = Math.max(startBrick.y, endBrick.y);

        // Create a new array with all the bricks within the range
        const rangeBricks = [];

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                rangeBricks.push({
                    x,
                    y,
                    name: `${x},${y}`,
                });
            }
        }

        // Add bricks that are in the selected range
        for (const b of selectedBricks) {
            if (
                b.x >= minX &&
                b.x <= maxX &&
                b.y >= minY &&
                b.y <= maxY
            ) {
                continue; // Skip bricks that are within the new range
            }

            newSelectedBricks.push(b);
        }

        // Add all the new bricks in the range
        for (const b of rangeBricks) {
            newSelectedBricks.push(b);
        }

        setSelectedBricks(newSelectedBricks);
    }, [selectedBricks, setSelectedBricks]);

    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!canvas) {
            return;
        }

        if (!lastPointerPosition) {
            console.log(`No last pointer position??`);
            return;
        }

        const startBrick = getBrickFromPointerPosition(
            lastPointerPosition,
            canvas,
            BRICKS_PER_ROW,
            BRICKS_PER_COLUMN,
        );

        const endBrick = getBrickFromPointerPosition(
            e.pointer,
            canvas,
            BRICKS_PER_ROW,
            BRICKS_PER_COLUMN,
        );

        /* TODO: Validate bricks are not owned already */
        if (startBrick.name === endBrick.name) {
            toggleBrickSelectedState(startBrick);
        } else {
            selectBrickRange(startBrick, endBrick);
        }
    }, [
        lastPointerPosition,
        toggleBrickSelectedState,
        selectBrickRange,
        canvas,
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
            }
        }

        setSelectedCanvasObjects(newSelectedCanvasObjects);

        console.log(newSelectedCanvasObjects.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        canvas,
        selectedBricks,
        brickHeight,
        brickWidth,
    ]);

    useEffect(() => {
        if (!canvas || !interactable) {
            return;
        }

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:up', handleMouseUp);

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:up', handleMouseUp);
        }
    }, [
        canvas,
        lastPointerPosition,
        handleMouseDown,
        handleMouseUp,
        interactable,
    ]);

    useEffect(() => {
        const c = interactable
            ? new Canvas(canvasRef.current!)
            : new StaticCanvas(canvasRef.current!);

        setCanvas(c);

        c.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        if (displayGridLines) {
            for (let i = 1; i < BRICKS_PER_ROW; i++) {
                const line = new Line([i * brickWidth, 0, i * brickWidth, canvasHeight], {
                    evented: false,
                    selectable: false,
                    stroke: '#C19A6B',
                    strokeWidth: 1,
                    opacity: 0.3,
                });

                c.add(line);
            }

            for (let i = 1; i < BRICKS_PER_COLUMN; i++) {
                const line = new Line([0, i * brickHeight, canvasWidth, i * brickHeight], {
                    evented: false,
                    selectable: false,
                    stroke: '#C19A6B',
                    strokeWidth: 1,
                    opacity: 0.3,
                });

                c.add(line);
            }
        }

        // Clean up on component unmount
        return () => {
            c.dispose();
        };
    }, [
        displayGridLines,
        canvasHeight,
        canvasWidth,
        interactable,
        brickHeight,
        brickWidth,
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
