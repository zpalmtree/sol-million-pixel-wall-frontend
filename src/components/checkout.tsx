import * as React from 'react';
import { useRecoilValue } from 'recoil';

import {
    DialogTitle,
    DialogDescription,
    DialogContent,
} from "@/components/ui/dialog";
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

export function CheckoutDialog() {
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
        <DialogContent>
            <div className="max-w-full rounded-lg bg-[#1A1A1A] p-6 text-white border border-[#C19A6B]">
                <DialogTitle className="text-2xl font-semibold tracking-tighter text-[#C19A6B]">
                    Million Pixel Wall
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm">
                    Create your masterpiece and immortalize it on our digital
                    canvas.
                </DialogDescription>
                <Tabs className="mt-6" defaultValue="create">
                    <TabsList className="grid w-full grid-cols-3 rounded-md bg-[#333333] px-1 sm:px-6 h-[60px] gap-1 sm:gap-2 border-2 border-[#C19A6B]">
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
                    </TabsList>
                    <TabsContent
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
                        value="create"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center justify-center w-full bg-[#333333] border border-[#C19A6B] aspect-square">
                                    <UploadPreview
                                        width={550}
                                        height={550}
                                    />
                                </div>
                            </div>
                            <div className="w-full items-center md:w-[250px] p-4 border border-[#C19A6B] rounded-md flex flex-col justify-between">
                                <div className="flex flex-col gap-y-4">
                                    <div className="mb-4 flex flex-col gap-y-4 items-center justify-between">
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
                            <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[150px]">
                                Continue
                            </Button>

                            <span>
                                Hint: You can scroll in and out on the canvas!
                            </span>
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
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
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
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
                </Tabs>
            </div>
        </DialogContent>
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
