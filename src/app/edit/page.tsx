'use client';

import * as React from 'react';
import {
    useRecoilValue,
    useRecoilState,
    useSetRecoilState,
} from 'recoil';
import Link from "next/link";
import * as fabric from 'fabric';

import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadPreview } from '@/components/upload-preview';
import { ColorPicker } from '@/components/color-picker';
import { PurchaseTab } from '@/components/purchase-tab';
import { UploadModifyTab } from '@/components/upload-modify-tab';
import { WalletMultiButton } from '@/components/wallet-button';
import { uploadPreviewCanvasState } from '@/state/upload-preview';
import { selectedPixelsState } from '@/state/pixels';
import { addedImagesState } from '@/state/images';
import {
    selectedOwnedBricksWithArtState,
    selectedOwnedBricksWithArtSetState,
} from '@/state/bricks';
import {
    calculateZoomLevel,
    calculateBrickCenter,
    zoomToCoordinate,
    groupBricks,
    createRectanglesFromCluster,
} from '@/lib/wall-utils';
import {
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';
import {
    uploadTabEnabledState,
    currentTabState,
} from '@/state/tabs';
import { pricePerBrickEditState } from '@/state/purchase';

export default function Checkout() {
    const canvas = useRecoilValue(uploadPreviewCanvasState);

    const [ images, setImages ] = useRecoilState(addedImagesState);
    const [ currentTab, setCurrentTab ] = useRecoilState(currentTabState);
    const setSelectedPixels = useSetRecoilState(selectedPixelsState);
    const selectedBricks = useRecoilValue(selectedOwnedBricksWithArtState);
    const selectedBricksSet = useRecoilValue(selectedOwnedBricksWithArtSetState);
    const uploadTabEnabled = useRecoilValue(uploadTabEnabledState);
    const pricePerBrickEdit = useRecoilValue(pricePerBrickEditState);
    
    const canvasWidth = 1000;
    const canvasHeight = 1000;
    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [ canvasWidth ]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [ canvasHeight ]);

    const nextTab = React.useMemo(() => {
        switch (currentTab) {
            case 'create': {
                return 'purchase';
            }
            case 'purchase': {
                return 'complete';
            }
            case 'upload': {
                return undefined;
            }
            default: {
                throw new Error('Unknown tab!');
            }
        }
    }, [
        currentTab,
    ]);

    const nextTabEnabled = React.useMemo(() => {
        if (!nextTab) {
            return false;
        }

        if (currentTab === 'purchase' && !uploadTabEnabled) {
            return false;
        }

        return true;
    }, [
        currentTab,
        nextTab,
        uploadTabEnabled,
    ]);

    const handleTabClicked = React.useCallback((e: any, tab: string) => {
        setCurrentTab(tab);
    }, [
        setCurrentTab,
    ]);

    const handleResetZoom = React.useCallback(() => {
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
        canvas,
        brickHeight,
        brickWidth,
        selectedBricks,
    ]);

    const handleClearCanvas = React.useCallback(() => {
        if (!canvas) {
            return;
        }

        setSelectedPixels([]);

        for (const image of images) {
            canvas.remove(image);
        }

        setImages([]);
    }, [
        canvas,
        setImages,
        setSelectedPixels,
        images,
    ]);

    const handleImageUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !canvas) {
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            if (e.target?.result) {
                const image = await fabric.Image.fromURL(e.target.result as string);

                // Calculate the center of the selected bricks
                const center = calculateBrickCenter(
                    selectedBricks,
                    brickWidth,
                    brickHeight,
                );

                // Determine the dimensions of the largest continuous selection area
                const brickClusters = groupBricks(selectedBricks, new Set<string>());
                let maxWidth = 0;
                let maxHeight = 0;

                for (const cluster of brickClusters) {
                    const rectangles = createRectanglesFromCluster(cluster);
                    for (const { minX, minY, maxX, maxY } of rectangles) {
                        const width = (maxX - minX + 1) * brickWidth;
                        const height = (maxY - minY + 1) * brickHeight;
                        if (width > maxWidth) {
                            maxWidth = width;
                        }
                        if (height > maxHeight) {
                            maxHeight = height;
                        }
                    }
                }

                // Set the image properties
                image.set({
                    left: center.x - maxWidth / 2,
                    top: center.y - maxHeight / 2,
                    scaleX: maxWidth / image.width,
                    scaleY: maxHeight / image.height,
                });

                canvas.add(image);
                canvas.bringObjectForward(image);

                setImages((images) => {
                    const newImages = [...images];
                    newImages.push(image);
                    return newImages;
                });
            }
        };

        reader.readAsDataURL(file);
    }, [
        canvas,
        setImages,
        selectedBricks,
        brickWidth,
        brickHeight,
    ]);

    return (
        <>
            <header className="flex items-center justify-between bg-[#1a1a1a] px-6 py-4 shadow-md">
                <div className="flex items-center gap-8">
                    <Link
                        className="text-2xl font-bold tracking-tighter text-primary"
                        href="/"
                    >
                        The Million Pixel Wall
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            className="text-primary hover:text-white"
                            href="/"
                        >
                            Home
                        </Link>
                        <Link
                            className="text-primary hover:text-white"
                            href="/wall"
                        >
                            Explore the Wall
                        </Link>
                        <Link
                            className="text-primary hover:text-white"
                            href="/wall"
                        >
                            Buy Bricks
                        </Link>
                        <Link
                            className="text-primary hover:text-white"
                            href="/owned"
                        >
                            My Bricks
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <WalletMultiButton
                    />
                </div>
            </header>

            <div className="flex flex-col items-center min-h-[100dvh] bg-[#1A1A1A] text-white">
                <main className="flex flex-col items-center mt-4 w-full px-8">
                    <Tabs
                        className="flex w-full gap-x-4 justify-start items-start"
                        orientation="vertical"
                        value={currentTab}
                    >
                        <TabsContent
                            className="w-[1280px]"
                            value="create"
                            forceMount={true}
                            style={{ display: currentTab === 'create' ? 'block' : 'none' }}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center justify-center w-full bg-[#333333] border border-[#C19A6B] aspect-square">
                                        <UploadPreview
                                            width={1000}
                                            height={1000}
                                            visible={currentTab === 'create'}
                                            selectedBricks={selectedBricks}
                                            selectedBricksSet={selectedBricksSet}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-min items-center md:w-[250px] p-4 gap-y-2 border border-[#C19A6B] rounded-md flex flex-col justify-between">
                                    <div className="flex flex-col gap-y-2">
                                        <div className="mb-2 flex flex-col gap-y-4 items-center justify-between">
                                            <Label
                                                className="text-sm font-medium"
                                                htmlFor="image"
                                            >
                                                Upload Image
                                            </Label>
                                            <Input
                                                accept="image/*"
                                                className="rounded-md bg-[#333333] px-3 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-[#C19A6B] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-[#444444] transition-colors duration-200 h-full"
                                                id="image"
                                                type="file"
                                                onChange={handleImageUpload}
                                            />
                                        </div>

                                        <ColorPicker
                                        />
                                    </div>

                                    <div className="flex flex-col items-center w-full gap-y-2">
                                        <Button
                                            className="w-full max-w-[250px]"
                                            onClick={handleResetZoom}
                                        >
                                            Reset Zoom
                                        </Button>

                                        <Button
                                            className="rounded-md border-none bg-red-500 px-12 py-2 text-white hover:bg-red-600 transition-colors duration-200 w-full max-w-[250px]"
                                            onClick={handleClearCanvas}
                                        >
                                            Clear Canvas
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-row items-center justify-between w-full gap-x-4">
                                <span>
                                    Hint: You can scroll in and out on the canvas!
                                </span>
                            </div>
                        </TabsContent>

                        <TabsContent
                            className="w-[1280px] h-[800px]"
                            value="purchase"
                        >
                            <PurchaseTab
                                selectedBricks={selectedBricks}
                                endpoint={'/purchase/modify'}
                                action={'edit'}
                                lamportsPerAction={pricePerBrickEdit}
                                successMessage={`Payment successfully submitted. Proceed to the next tab to upload your creation.`}
                            />
                        </TabsContent>

                        <TabsContent
                            className="w-[1280px] h-[800px]"
                            value="upload"
                        >
                            <UploadModifyTab
                                selectedBricks={selectedBricks}
                            />
                        </TabsContent>

                        <TabsList className="flex flex-col justify-between rounded-md bg-[#1A1A1A] p-4 gap-y-4 border border-[#C19A6B] md:w-[250px] h-[400px]">
                            <div className='flex flex-col gap-y-4'>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="create"
                                    onClick={(e) => handleTabClicked(e, 'create')}
                                    disabled={!nextTab}
                                >
                                    <span className="block truncate sm:hidden">
                                        Create
                                    </span>
                                    <span className="hidden sm:block">1. Create</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="purchase"
                                    onClick={(e) => handleTabClicked(e, 'purchase')}
                                    disabled={!nextTab}
                                >
                                    <span className="block truncate sm:hidden">
                                        Pay
                                    </span>
                                    <span className="hidden sm:block">2. Pay</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="upload"
                                    onClick={(e) => handleTabClicked(e, 'upload')}
                                    disabled={!uploadTabEnabled}
                                >
                                    <span className="block truncate sm:hidden">
                                        Upload
                                    </span>
                                    <span className="hidden sm:block">3. Upload</span>
                                </TabsTrigger>
                            </div>

                            <TabsTrigger
                                className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                value={nextTab || ''}
                                disabled={!nextTabEnabled}
                                onClick={(e) => handleTabClicked(e, nextTab!)}
                            >
                                <span className="block truncate">
                                    Continue
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </main>

                <footer className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full px-4 md:px-6 py-6 border-t border-primary mt-8">
                    <p className="text-xs text-[#EEEEEE] dark:text-[#EEEEEE]">
                        © 2024 Wall On Solana. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link
                            className="text-xs hover:underline underline-offset-4 text-primary"
                            href="https://twitter.com/WallOnSolana"
                        >
                            Twitter
                        </Link>
                        <Link
                            className="text-xs hover:underline underline-offset-4 text-primary"
                            href="http://wallonsolana.com/"
                        >
                            Website
                        </Link>
                    </nav>
                </footer>
            </div>
        </>
    );
}
