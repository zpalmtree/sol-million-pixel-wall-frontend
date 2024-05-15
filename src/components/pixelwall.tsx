'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas, Rect } from 'fabric';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

export interface PixelWallProps {
    /* Width of canvas. Defaults to DEFAULT_WIDTH. */
    width?: number;

    /* Height of canvas. Defaults to DEFAULT_HEIGHT. */
    height?: number;

    /* Whether the user can interactive with the canvas. Defaults to false */
    interactable?: boolean;
}

export function PixelWall(props: PixelWallProps) {
    const {
        width,
        height,
    } = props;

    const canvasWidth = React.useMemo(() => width || DEFAULT_WIDTH, [ width ]);
    const canvasHeight = React.useMemo(() => height || DEFAULT_HEIGHT, [ height ]);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new Canvas(canvasRef.current);

        canvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        // Example: Add a rectangle to the canvas
        const rect = new Rect({
            left: 100,
            top: 100,
            fill: '#C19A6B',
            width: 50,
            height: 50
        });

        canvas.add(rect);

        // Clean up on component unmount
        return () => {
            canvas.dispose();
        };
    }, []);

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
