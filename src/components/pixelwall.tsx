'use client';

import React, { useEffect, useRef } from 'react';
import {
    Canvas,
    StaticCanvas,
    Line,
    Rect,
    Group,
} from 'fabric';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const BRICKS_PER_ROW = 40;
const BRICKS_PER_COLUMN = 40;

export interface PixelWallProps {
    /* Width of canvas. Defaults to DEFAULT_WIDTH. */
    width?: number;

    /* Height of canvas. Defaults to DEFAULT_HEIGHT. */
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

    const canvasWidth = React.useMemo(() => width || DEFAULT_WIDTH, [ width ]);
    const canvasHeight = React.useMemo(() => height || DEFAULT_HEIGHT, [ height ]);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = interactable
            ? new Canvas(canvasRef.current)
            : new StaticCanvas(canvasRef.current);

        canvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        const handleBrickSelected = (e) => {
            const target = e.target;

            if (target) {
                if (target.fill === '#C19A6B') {
                    target.set({
                        fill: '#1A1A1A',
                        opacity: 1,
                    });
                } else {
                    target.set({
                        fill: '#C19A6B',
                        opacity: 0.3,
                    });
                }
            }
        }

        if (displayGridLines) {
            /* TODO: What if these aren't round numbers? */
            const brickWidth = canvasWidth / BRICKS_PER_ROW;
            const brickHeight = canvasHeight / BRICKS_PER_COLUMN;

            for (let i = 0; i < BRICKS_PER_COLUMN; i++) {
                for (let j = 0; j < BRICKS_PER_ROW; j++) {
                    const leftOffset = j * brickWidth;
                    const topOffset = i * brickHeight;

                    const brick = new Rect({
                        left: leftOffset,
                        top: topOffset,
                        fill: '#1A1A1A',
                        stroke: '#C19A6B',
                        strokeWidth: 1,
                        width: brickWidth,
                        height: brickHeight,
                        selectable: false,
                        hoverCursor: 'pointer', /* TODO: Disable if purchased? */
                    });

                    brick.on('mousedown', handleBrickSelected);

                    canvas.add(brick);
                }
            }
        }

        const handleSelection = (event) => {
            const selection = canvas.getActiveObject();

            console.log('selection');

            if (selection && selection.type === 'activeSelection') {
                const { left, top, width, height } = selection;
                console.log('Selection Box Coordinates:', { left, top, width, height });
            }
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);

        // Clean up on component unmount
        return () => {
            canvas.dispose();
        };
    }, [displayGridLines]);

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
