'use client';

import * as React from 'react';
import { useRecoilValue } from 'recoil';
import Link from "next/link";

import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadPreview } from '@/components/upload-preview';
import { ColorPicker } from '@/components/color-picker';
import { uploadPreviewCanvasState } from '@/state/upload-preview';
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";

export default function Checkout() {
    const uploadPreviewCanvas = useRecoilValue(uploadPreviewCanvasState);

    const handleResetZoom = React.useCallback(() => {
        if (!uploadPreviewCanvas) {
            return;
        }

        uploadPreviewCanvas.setZoom(1);
        uploadPreviewCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    }, [
        uploadPreviewCanvas,
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
                    <Button
                        size="sm"
                    >
                        Connect Wallet
                    </Button>
                </div>
            </header>

            <div className="flex flex-col items-center min-h-[100dvh] bg-[#1A1A1A] text-white">
                <main className="flex flex-col items-center mt-4 w-full px-8">
                    <Tabs className="flex w-full gap-x-4 justify-start items-start" defaultValue="create" orientation="vertical">
                        
                        <TabsContent
                            className="w-[1280px]"
                            value="create"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center justify-center w-full bg-[#333333] border border-[#C19A6B] aspect-square">
                                        <UploadPreview
                                            width={1000}
                                            height={1000}
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

                                        <Button className="rounded-md border-none bg-red-500 px-12 py-2 text-white hover:bg-red-600 transition-colors duration-200 w-full max-w-[250px]">
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
                            <div className="">
                                <Card className="bg-[#333333] p-6 border border-[#C19A6B]">
                                    <CardHeader>
                                        <CardTitle className="text-white">
                                            Solana Payment
                                        </CardTitle>
                                        <CardDescription className="text-white">
                                            Approve the transaction in your wallet
                                            to purchase your brick NFTs and upload
                                            your creation!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="text-4xl font-bold text-primary">
                                            0.5 SOL
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="mt-6">
                                <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[150px]">
                                    Pay
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent
                            className="w-[1280px] h-[800px]"
                            value="complete"
                        >
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <CircleCheckIcon className="mx-auto mb-4 h-16 w-16 text-[#C19A6B]" />
                                    <h3 className="text-2xl font-semibold tracking-tighter">
                                        Congratulations!
                                    </h3>
                                    <p className="mt-2 text-gray-400">
                                        Your masterpiece has been immortalized on
                                        our digital canvas.
                                    </p>
                                    <Button variant="brown">View Wall</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsList className="flex flex-col justify-between rounded-md bg-[#1A1A1A] p-4 gap-y-4 border border-[#C19A6B] md:w-[250px] h-[400px]">
                            <div className='flex flex-col gap-y-4'>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="create"
                                >
                                    <span className="block truncate sm:hidden">
                                        Create
                                    </span>
                                    <span className="hidden sm:block">1. Create</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="purchase"
                                >
                                    <span className="block truncate sm:hidden">
                                        Purchase
                                    </span>
                                    <span className="hidden sm:block">2. Purchase</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                                    value="complete"
                                >
                                    <span className="block truncate sm:hidden">
                                        Complete
                                    </span>
                                    <span className="hidden sm:block">3. Complete</span>
                                </TabsTrigger>
                            </div>

                            <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-full">
                                Continue
                            </Button>
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

function CircleCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}