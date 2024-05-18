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

    const canvasWidth = React.useMemo(() => width || CANVAS_WIDTH, [ width ]);

    const canvasHeight = React.useMemo(() => height || CANVAS_HEIGHT, [ height ]);

    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [
        canvasWidth,
    ]);

    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [
        canvasHeight,
    ]);

    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const [ canvas, setCanvas ] = useRecoilState(uploadPreviewCanvasState);

    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
    }, [
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

            if (zoom > 20) {
                zoom = 20;
            }

            if (zoom < 1) {
                zoom = 1;
                canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
            }

            canvas.zoomToPoint({
                x: opt.e.offsetX,
                y: opt.e.offsetY
            }, zoom);

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
        const c = new Canvas(canvasRef.current!);

        setCanvas(c);

        c.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

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

        // Clean up on component unmount
        return () => {
            c.dispose();
        };
    }, [
        canvasHeight,
        canvasWidth,
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
