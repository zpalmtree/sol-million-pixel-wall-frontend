import * as React from 'react';
import {
    useRecoilValue,
} from 'recoil';

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    selectedBricksState,
} from '@/state/bricks';
import { uploadPreviewCanvasState } from '@/state/upload-preview';
import { renderSelectedBricksToImage } from '@/lib/wall-utils';
import {
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
} from '@/constants';

export function PurchaseTab() {
    const canvas = useRecoilValue(uploadPreviewCanvasState);
    const selectedBricks = useRecoilValue(selectedBricksState);

    const canvasWidth = 1000;
    const canvasHeight = 1000;
    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [ canvasWidth ]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [ canvasHeight ]);

    const [imageSrc, setImageSrc ] = React.useState<string | undefined>();

    React.useEffect(() => {
        const generateImage = async () => {
            if (!canvas || selectedBricks.length === 0) {
                setImageSrc(undefined);
                return;
            }

            const image = await renderSelectedBricksToImage(
                selectedBricks,
                canvas,
                brickWidth,
                brickHeight,
            );

            if (image) {
                setImageSrc(image);
            }
        };

        generateImage();
    }, [
        canvas,
        selectedBricks,
        brickWidth,
        brickHeight,
    ]);

    return (
        <>
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

                    <CardContent className="flex flex-col gap-y-4">
                        {imageSrc && (
                            <div className='flex flex-col gap-y-4'>
                                <span className='text-white text-sm'>
                                    Preview of your creation
                                </span>

                                <img
                                    src={imageSrc}
                                    alt='Creation Preview'
                                    className='w-[300px] rounded border-2 border-primary'
                                />
                            </div>
                        )}
                        
                        <div className="text-4xl font-bold text-primary mt-4">
                            0.5 SOL
                        </div>

                        <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[150px]">
                            Pay
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
