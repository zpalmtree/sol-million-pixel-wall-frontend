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
import { getBrickFromPointerPosition } from '@/lib/wall-utils';
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

        console.log(newSelectedBricks);

        setSelectedBricks(newSelectedBricks);
    }, [
        selectedBricks,
        setSelectedBricks,
    ]);

    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!lastPointerPosition) {
            console.log(`No last pointer position??`);
            return;
        }

        const startBrick = getBrickFromPointerPosition(
            lastPointerPosition,
            canvasWidth,
            canvasHeight,
            BRICKS_PER_ROW,
            BRICKS_PER_COLUMN,
        );

        const endBrick = getBrickFromPointerPosition(
            e.pointer,
            canvasWidth,
            canvasHeight,
            BRICKS_PER_ROW,
            BRICKS_PER_COLUMN,
        );

        /* Selected single brick. Basic toggle */
        /* TODO: Validate bricks are not owned already */
        if (startBrick.name === endBrick.name) {
            toggleBrickSelectedState(startBrick);
        }

        console.log(`Starting brick: ${startBrick.name}, Ending brick: ${endBrick.name}`);
    }, [
        lastPointerPosition,
        canvasHeight,
        canvasWidth,
        toggleBrickSelectedState,
    ]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        for (const canvasObject of selectedCanvasObjects) {
            canvas.remove(canvasObject);
        }

        const newSelectedCanvasObjects = [];

        /* TODO: Somewhat inefficient adding and removing all. Ideally we would just
         * modify the delta */
        for (const brick of selectedBricks) {
            const rectangle = new Rect({
                width: brickWidth,
                height: brickHeight,
                fill: '#C19A6B',
                opacity: 0.3,
                selectable: false,
                evented: false,
                left: (brick.x * brickWidth),
                top: (brick.y * brickHeight),
                strokeWidth: 0,
            });

            newSelectedCanvasObjects.push(rectangle);
            canvas.add(rectangle);
        }

        setSelectedCanvasObjects(newSelectedCanvasObjects);
    }, [
        canvas,
        selectedBricks,
        brickHeight,
        brickWidth,
        selectedCanvasObjects,
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
