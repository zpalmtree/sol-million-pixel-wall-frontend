import * as React from 'react';
import {
    useRecoilValue,
    useRecoilState,
} from 'recoil';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useWallet } from '@solana/wallet-adapter-react';
import Link from "next/link";
import {
    Transaction,
    SystemProgram,
    Connection,
    PublicKey,
} from '@solana/web3.js';

import { Button } from "@/components/ui/button";
import {
    uploadPreviewImageState,
    uploadPreviewCanvasState,
} from '@/state/upload-preview';
import { renderBrickToImage, renderSelectedBricksToImage } from '@/lib/wall-utils';
import { BRICKS_PER_ROW, BRICKS_PER_COLUMN, RPC } from '@/constants';
import {
    Brick,
} from '@/types/brick';
import { Switch } from '@/components/switch';

export interface UploadTabProps {
    selectedBricks: Brick[];
}

export function UploadTab(props: UploadTabProps) {
    const { selectedBricks } = props;

    const [complete, setComplete] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [imageSrc, setImageSrc] = useRecoilState(uploadPreviewImageState);
    const canvas = useRecoilValue(uploadPreviewCanvasState);
    const { publicKey, signMessage, signTransaction } = useWallet();
    const [url, setUrl] = React.useState<string>('');
    const [isLedger, setIsLedger] = React.useState(false);

    const canvasWidth = 1000;
    const canvasHeight = 1000;
    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [canvasWidth]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [canvasHeight]);

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
        setImageSrc,
    ]);

    const handleUpload = React.useCallback(async () => {
        if (!publicKey || (!signMessage && !signTransaction) || !canvas) {
            setError("Wallet not connected or signing function not available");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            let signedMessage;
            let serializedTransaction;

            if (isLedger) {
                // Create a transaction that sends 0 SOL from the user to themselves
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey('9hLBcTppq5DUziXTnuUtorbzKSDzM8cFz3FSvUgD8Nsf'),
                        lamports: 1,
                    })
                );

                const connection = new Connection(RPC);

                const recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;

                transaction.feePayer = publicKey;
                transaction.recentBlockhash = recentBlockhash;

                const signedTransaction = await signTransaction!(transaction);

                const serialized = signedTransaction.serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                });

                serializedTransaction = serialized.toString('base64');
            } else {
                const message = `I am signing this message to confirm that ${publicKey.toString()} can upload images to the meme wall`;
                const encodedMessage = new TextEncoder().encode(message);
                signedMessage= await signMessage!(encodedMessage);
            }

            const images = await Promise.all(selectedBricks.map(async (brick) => {
                const imageDataURL = await renderBrickToImage(brick, canvas, brickWidth, brickHeight);

                return {
                    x: brick.x,
                    y: brick.y,
                    image: imageDataURL,
                };
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images,
                    solAddress: publicKey.toString(),
                    signedMessage: signedMessage
                        ? Array.from(signedMessage)
                        : undefined,
                    serializedTransaction,
                    url,
                }),
            });

            const raw = await response.text();

            try {
                const { success, error } = await JSON.parse(raw);

                if (success) {
                    setComplete(true);
                } else {
                    if (error) {
                        setError(`Upload failed: ${error} Please try again.`);
                    } else {
                        setError('Upload failed. Please try again.');
                    }
                }
            } catch (err) {
                setError(`Upload failed: ${raw}. Please try again.`);
            }
        } catch (err: any) {
            setError(`Upload failed: ${err.message}. Please try again.`);
        } finally {
            setUploading(false);
        }
    }, [
        publicKey,
        brickHeight,
        brickWidth,
        canvas,
        selectedBricks,
        signMessage,
        signTransaction,
        url,
        isLedger,
    ]);

    if (complete) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <CircleCheckIcon className="mx-auto mb-4 h-16 w-16 text-primary" />
                    <h3 className="text-2xl font-semibold tracking-tighter">
                        Congratulations!
                    </h3>
                    <p className="mt-2 text-gray-400">
                        Your masterpiece has been immortalized on our digital canvas.
                    </p>
                    <Link
                        href='/wall'
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-[#1A1A1A] dark:hover:bg-primary/90 dark:focus-visible:ring-primary mt-6"
                    >
                        View Wall
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <Card className="bg-[#333333] p-6 border border-primary">
                <CardHeader>
                    <CardTitle className="text-white">
                        Upload your creation
                    </CardTitle>
                    <CardDescription className="text-white">
                        Hit upload to store your creation on the meme wall! You will need to sign a message to confirm your upload.
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

                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Optional URL"
                        className="bg-[#444444] text-white rounded-md px-4 py-2 mt-2"
                    />

                    <div className="flex flex-col items-start gap-y-2">
                        <span className="text-white">Using Ledger?</span>
                        <Switch
                            left="No"
                            right="Yes"
                            onChange={setIsLedger}
                            isRight={isLedger}
                        />
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-primary transition-colors duration-200 w-[220px]"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>

                    {error && (
                        <span className='text-red-500'>
                            {error}
                        </span>
                    )}

                    <span className='text-white'>
                        {`Note: If you exit this page without uploading, you will still be able to return later and upload your design using the 'My Bricks' page.`}
                    </span>
                </CardContent>
            </Card>
        </div>
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
