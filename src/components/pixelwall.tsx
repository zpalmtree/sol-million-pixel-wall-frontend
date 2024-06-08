'use client';

import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
    useRecoilState,
    useSetRecoilState,
} from 'recoil';
import {
    Canvas,
    StaticCanvas,
    Rect,
    Line,
    TPointerEvent,
    TPointerEventInfo,
    Image,
    Point,
} from 'fabric';

import { Coordinate } from '@/types/coordinate';
import { Brick } from '@/types/brick';
import { SelectedBrick } from '@/types/selected-brick';
import {
    getBrickFromPointerPosition,
    groupBricks,
    createRectanglesFromCluster,
    getWallInfo,
    zoomToCoordinate,
    calculateBrickCenter,
    calculateZoomLevel,
} from '@/lib/wall-utils';
import {
    startingBricksState,
} from '@/state/bricks';
import {
    startingPixelWallImageState,
} from '@/state/images';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';
import {
    pricePerBrickState,
    pricePerBrickEditState,
} from '@/state/purchase';

export interface PixelWallProps {
    /* Width of canvas. Defaults to CANVAS_WIDTH. */
    width?: number;

    /* Height of canvas. Defaults to CANVAS_HEIGHT. */
    height?: number;

    /* Whether the user can interactive with the canvas. Defaults to false */
    interactable?: boolean;

    /* Whether we should draw the 'block' lines. Defaults to true */
    displayGridLines?: boolean;

    selectedBricks: SelectedBrick[];

    setSelectedBricks: (bricks: SelectedBrick[]) => void;

    /* Bricks that have already been purchased */
    purchasedBricks?: Brick[];

    /* Bricks that can be selected */
    availableBricks?: Brick[];

    /* Color bricks that can be selected */
    highlightAvailableBricks?: boolean;

    /* Make the bricks selected the area of focus of the canvas */
    zoomToAvailableBricks?: boolean;

    /* Color bricks that are already purchased */
    highlightPurchasedBricks?: boolean;

    /* Interactable must be set to true for this parameter to do anything. Defaults
     * to true */
    permitBrickSelection?: boolean;
}


export function PixelWall(props: PixelWallProps) {
    const {
        width,
        height,
        interactable = false,
        displayGridLines = true,
        selectedBricks,
        setSelectedBricks,
        purchasedBricks,
        availableBricks,
        highlightAvailableBricks = false,
        zoomToAvailableBricks = false,
        highlightPurchasedBricks = false,
        permitBrickSelection = true,
    } = props;

    const canvasWidth = React.useMemo(() => width || CANVAS_WIDTH, [ width ]);
    const canvasHeight = React.useMemo(() => height || CANVAS_HEIGHT, [ height ]);

    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [ canvasWidth ]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [ canvasHeight ]);

    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    const [ canvas, setCanvas ] = React.useState<Canvas | StaticCanvas | undefined>();
    const [ lastPointerPosition, setLastPointerPosition ] = React.useState<Coordinate | undefined>();
    const [ itemsOnCanvas, setItemsOnCanvas ] = React.useState<any[]>([]);
    const [ backgroundImage, setBackgroundImage ] = React.useState<Image | undefined>(undefined);
    const [ isPanning, setIsPanning ] = React.useState(false);

    const setStartingBricks = useSetRecoilState(startingBricksState);
    const [ startingPixelWallImage, setStartingPixelWallImage ] = useRecoilState(startingPixelWallImageState);
    const setPricePerBrick = useSetRecoilState(pricePerBrickState);
    const setPricePerBrickEdit = useSetRecoilState(pricePerBrickEditState);

    const availableBricksSet = React.useMemo(() => {
        if (!availableBricks) {
            return new Set();
        }

        return new Set(availableBricks.map((a) => a.name));
    }, [
        availableBricks,
    ]);

    const purchasedBricksSet = React.useMemo(() => {
        if (!purchasedBricks) {
            return new Set();
        }

        return new Set(purchasedBricks.map((a) => a.name));
    }, [
        purchasedBricks,
    ]);

    const handleMouseDown = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if ((e.e as any).button === 2) {
            setIsPanning(true);

            setLastPointerPosition({
                x: (e.e as any).clientX,
                y: (e.e as any).clientY,
            });
        } else {
            setLastPointerPosition(e.pointer);
        }
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

        // Filter out purchased bricks and check if any bricks remain
        const filteredBricks = rangeBricks.filter(b => !purchasedBricksSet.has(b.name));
        const finalBricks = availableBricks ? filteredBricks.filter(b => availableBricksSet.has(b.name)) : filteredBricks;

        if (!availableBricks && filteredBricks.length !== rangeBricks.length) {
            toast.warn(`One or more bricks in the range you selected have already been purchased, and thus have not been selected.`);
        }

        if (finalBricks.length === 0) {
            if (availableBricks) {
                toast.warn(`None of these bricks are valid for your current operation.`);
                return;
            } else {
                toast.warn(`All of these bricks have been purchased already.`);
                return;
            }
        }

        // Add bricks that are in the selected range and not in the finalBricks set
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

        // Add all the new bricks in the range that are available
        for (const b of finalBricks) {
            newSelectedBricks.push(b);
        }

        setSelectedBricks(newSelectedBricks);
    }, [
        selectedBricks,
        setSelectedBricks,
        purchasedBricksSet,
        availableBricksSet,
        availableBricks,
    ]);

    const handleMouseUp = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!canvas) {
            return;
        }

        setIsPanning(false);

        if ((e.e as any).button === 2) {
            setLastPointerPosition(undefined);
            return;
        }

        if (!lastPointerPosition) {
            console.log(`No last pointer position??`);
            return;
        }

        if (!permitBrickSelection) {
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

        if (startBrick.name === endBrick.name) {
            if (purchasedBricksSet.has(startBrick.name)) {
                console.log('Brick already purchased, skipping');
                toast.warn('This brick has already been purchased.');
                return;
            }

            if (availableBricks && !availableBricksSet.has(startBrick.name)) {
                console.log('Brick not owned, skipping');
                toast.warn('This brick is not valid for your current operation.');
                return;
            }

            toggleBrickSelectedState(startBrick);
        } else {
            selectBrickRange(startBrick, endBrick);
        }
    }, [
        lastPointerPosition,
        toggleBrickSelectedState,
        selectBrickRange,
        canvas,
        purchasedBricksSet,
        availableBricksSet,
        availableBricks,
        permitBrickSelection,
    ]);

    const handleMouseWheel = React.useCallback((opt: any) => {
        if (!canvas) {
            return;
        }

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
    }, [
        canvas,
    ]);

    const handleMouseMove = React.useCallback((e: TPointerEventInfo<TPointerEvent>) => {
        if (!canvas || !isPanning || !lastPointerPosition) {
            return;
        }

        const vpt = canvas.viewportTransform;

        vpt[4] += (e.e as any).clientX - lastPointerPosition.x;
        vpt[5] += (e.e as any).clientY - lastPointerPosition.y;

        canvas.setViewportTransform(vpt);

        setLastPointerPosition({
            x: (e.e as any).clientX,
            y: (e.e as any).clientY,
        });
    }, [
        canvas,
        isPanning,
        lastPointerPosition,
    ]);

    const loadInitialInfo = React.useCallback(async () => {
        if (startingPixelWallImage) {
            return;
        }

        console.log('Loading initial info');

        const {
            image,
            bricks,
            error,
            pricePerBrick,
            pricePerBrickEdit,
        } = await getWallInfo();

        if (error) {
            toast.warn(`Failed to load wall info: ${error}`);
            return;
        }

        setStartingPixelWallImage(image);
        setStartingBricks(bricks);

        if (pricePerBrick !== undefined) {
            setPricePerBrick(pricePerBrick);
        }

        if (pricePerBrickEdit !== undefined) {
            setPricePerBrickEdit(pricePerBrickEdit);
        }
    }, [
        startingPixelWallImage,
        setStartingPixelWallImage,
        setStartingBricks,
        setPricePerBrick,
        setPricePerBrickEdit,
    ]);

    const drawCanvas = React.useCallback(async () => {
        if (!canvas) {
            return;
        }

        /* Remove previously drawn items */
        for (const canvasObject of itemsOnCanvas) {
            canvas.remove(canvasObject);
        }

        const newItemsOnCanvas: any[] = [];

        if (interactable) {
            if (highlightAvailableBricks && availableBricks) {
                const visitedBricks = new Set<string>();

                // Detect and merge overlapping bricks
                const brickClusters = groupBricks(availableBricks, visitedBricks);

                // Create rectangles for each cluster of bricks
                for (const cluster of brickClusters) {
                    const rectangles = createRectanglesFromCluster(cluster);

                    for (const { minX, minY, maxX, maxY } of rectangles) {
                        const rectangle = new Rect({
                            width: (maxX - minX + 1) * brickWidth,
                            height: (maxY - minY + 1) * brickHeight,
                            fill: '#1E90FF',
                            opacity: 0.3,
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
            }

            if (highlightPurchasedBricks && purchasedBricks) {
                const visitedBricks = new Set<string>();

                // Detect and merge overlapping bricks
                const brickClusters = groupBricks(purchasedBricks, visitedBricks);

                // Create rectangles for each cluster of bricks
                for (const cluster of brickClusters) {
                    const rectangles = createRectanglesFromCluster(cluster);

                    for (const { minX, minY, maxX, maxY } of rectangles) {
                        const rectangle = new Rect({
                            width: (maxX - minX + 1) * brickWidth,
                            height: (maxY - minY + 1) * brickHeight,
                            fill: 'red',
                            opacity: 0.25,
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
            }

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
                        opacity: highlightAvailableBricks ? 0.6 : 0.3,
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
        }

        if (startingPixelWallImage && !backgroundImage) {
            const backgroundImage = await Image.fromURL(startingPixelWallImage);

            backgroundImage.scaleToWidth(canvasWidth);
            backgroundImage.scaleToHeight(canvasHeight);
            backgroundImage.selectable = false;
            backgroundImage.evented = false;

            canvas.add(backgroundImage);
            setBackgroundImage(backgroundImage);
        }

        setItemsOnCanvas(newItemsOnCanvas);
    }, [
        canvas,
        selectedBricks,
        brickHeight,
        brickWidth,
        startingPixelWallImage,
        canvasHeight,
        canvasWidth,
        interactable,
        itemsOnCanvas,
        backgroundImage,
        availableBricks,
        purchasedBricks,
        highlightAvailableBricks,
        highlightPurchasedBricks,
    ]);

    useEffect(() => {
        drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        canvas,
        selectedBricks,
        availableBricks,
        brickHeight,
        brickWidth,
        startingPixelWallImage,
    ]);

    useEffect(() => {
        if (!canvas || !zoomToAvailableBricks || !availableBricks) {
            return;
        }

        const zoom = calculateZoomLevel(
            availableBricks,
            canvasWidth,
            canvasHeight,
        );

        const center = calculateBrickCenter(
            availableBricks,
            brickWidth,
            brickHeight,
        );

        if (zoom !== 1) {
            zoomToCoordinate(
                canvas as Canvas,
                center,
                zoom,
            );
        } else {
            canvas.setZoom(1);
            canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        }
    }, [
        canvas,
        availableBricks,
        brickHeight,
        brickWidth,
        canvasHeight,
        canvasWidth,
        zoomToAvailableBricks,
    ]);

    useEffect(() => {
        if (!canvas || !interactable) {
            return;
        }

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:up', handleMouseUp);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:wheel', handleMouseWheel);

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:up', handleMouseUp);
            canvas.off('mouse:move', handleMouseMove);
            canvas.off('mouse:wheel', handleMouseWheel);
        }
    }, [
        canvas,
        lastPointerPosition,
        handleMouseDown,
        handleMouseUp,
        handleMouseWheel,
        handleMouseMove,
        interactable,
    ]);

    useEffect(() => {
        const c = interactable
            ? new Canvas(canvasRef.current!, {
                fireRightClick: true,
                stopContextMenu: true,
            })
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
            }}
        />
    );
}
