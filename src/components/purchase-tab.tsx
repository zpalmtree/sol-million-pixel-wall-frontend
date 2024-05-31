import * as React from 'react';
import {
    useRecoilValue,
    useSetRecoilState,
    useRecoilState,
} from 'recoil';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from '@/components/wallet-button';
import {
    uploadPreviewCanvasState,
    uploadPreviewImageState,
} from '@/state/upload-preview';
import { renderSelectedBricksToImage } from '@/lib/wall-utils';
import {
    uploadTabEnabledState,
    currentTabState,
} from '@/state/tabs';
import {
    BRICKS_PER_ROW,
    BRICKS_PER_COLUMN,
    RPC,
} from '@/constants';
import { formatSOL, formatError } from '@/lib/utils';
import { TransactionSender } from '@/lib/transaction-sender';
import {
    Brick,
} from '@/types/brick';

export interface PurchaseTabProps {
    selectedBricks: Brick[];

    endpoint: string;

    action: string;

    lamportsPerAction: number;

    successMessage: string;
}

export function PurchaseTab(props: PurchaseTabProps) {
    const {
        selectedBricks,
        endpoint,
        action,
        lamportsPerAction,
        successMessage,
    } = props;

    const {
        publicKey,
        signAllTransactions,
    } = useWallet();

    const canvas = useRecoilValue(uploadPreviewCanvasState);
    const setUploadTabEnabled = useSetRecoilState(uploadTabEnabledState);
    const setCurrentTab = useSetRecoilState(currentTabState);
    const [imageSrc, setImageSrc] = useRecoilState(uploadPreviewImageState);

    const canvasWidth = 1000;
    const canvasHeight = 1000;
    const brickWidth = React.useMemo(() => canvasWidth / BRICKS_PER_ROW, [canvasWidth]);
    const brickHeight = React.useMemo(() => canvasHeight / BRICKS_PER_COLUMN, [canvasHeight]);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | undefined>();
    const [success, setSuccess] = React.useState<string | undefined>();
    const [successfulTransactions, setSuccessfulTransactions] = React.useState<number>(0);
    const [retryTransactions, setRetryTransactions] = React.useState<Brick[]>([]);
    const [statusText, setStatusText] = React.useState<string>('');

    const costInSol = React.useMemo(() => {
        const lamports = selectedBricks.length * lamportsPerAction;
        return formatSOL(lamports, 1);
    }, [
        selectedBricks,
        lamportsPerAction,
    ]);

    const payButtonDisabled = React.useMemo(() => {
        if (loading) {
            return true;
        }

        if (successfulTransactions > 0) {
            return true;
        }

        if (retryTransactions.length > 0) {
            return true;
        }

        if (success !== undefined) {
            return true;
        }

        return false;
    }, [
        loading,
        successfulTransactions,
        retryTransactions,
        success,
    ]);

    const handleNextTab = React.useCallback(() => {
        setCurrentTab('upload');
    }, [
        setCurrentTab,
    ]);

    const checkBalance = React.useCallback(async () => {
        if (!publicKey) {
            return false;
        }

        const connection = new Connection(RPC);
        const balance = await connection.getBalance(publicKey);

        return balance >= selectedBricks.length * lamportsPerAction;
    }, [
        publicKey,
        selectedBricks.length,
        lamportsPerAction,
    ]);

    const handlePurchasePixels = React.useCallback(async (retryBricks: Brick[] = selectedBricks) => {
        if (!publicKey || !signAllTransactions) {
            return;
        }

        setLoading(true);
        setError(undefined);
        setSuccess(undefined);
        setStatusText('Forming transactions, please wait...');

        try {
            const hasEnoughBalance = await checkBalance();

            if (!hasEnoughBalance) {
                setError('Insufficient SOL to buy these bricks!');
                setLoading(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coordinates: retryBricks.map((b) => ({ x: b.x, y: b.y })),
                    solAddress: publicKey.toString(),
                }),
            });

            const { transactions, error } = await response.json();

            if (error) {
                setError(error);
                setLoading(false);
                return;
            }

            const connection = new Connection(RPC);
            const transactionObjects = transactions.map((txBase64: string) => Transaction.from(Buffer.from(txBase64, 'base64')));

            setStatusText(`Sign the transaction(s) in your wallet to proceed with your ${action}.`);

            const signedTransactions: Transaction[] = await signAllTransactions(transactionObjects);

            setStatusText('Sending transaction(s), please wait...');

            if (signedTransactions.length !== transactionObjects.length) {
                console.log(`Expected ${transactionObjects.length} from adapter, got ${signedTransactions.length}`);
                // TODO: Abort?
            }

            const inProgressTransactions = [];
            let minTransactionSlot;

            const timeouts: Brick[] = [];
            const errors: Brick[] = [];
            const errorMessages: string[] = [];

            const successfullyPurchased = [];

            for (const signedTransaction of signedTransactions) {
                const sender = new TransactionSender(
                    connection,
                    signedTransaction,
                    Math.floor(120 / 20),
                    4_000,
                    true,
                );

                inProgressTransactions.push(sender.sendAndConfirmTransaction());
            }

            let i = 0;
            const itemsSplitByTransaction = retryBricks;

            for (const transaction of inProgressTransactions) {
                const brick = itemsSplitByTransaction[i++];

                console.log(`Waiting for transaction to complete...`);

                const {
                    error,
                    timeout,
                    slot,
                    signature,
                } = await transaction;

                if (!minTransactionSlot || slot < minTransactionSlot) {
                    minTransactionSlot = slot;
                }

                if (timeout) {
                    timeouts.push(brick);
                } else if (error) {
                    errors.push(brick);
                    errorMessages.push(formatError(error));
                } else {
                    successfullyPurchased.push({
                        brick,
                        signature,
                    });
                }
            }

            if (timeouts.length > 0) {
                setError(`Timeout occurred for ${timeouts.length} transaction(s).`);
            }

            if (errors.length > 0) {
                setError(`Error occurred for ${errors.length} transaction(s): ${errorMessages.join(', ')}`);
            }

            if (errors.length === 0 && timeouts.length === 0) {
                setSuccess(successMessage);
                setUploadTabEnabled(true);
            }

            const failed = errors.concat(timeouts);

            setSuccessfulTransactions(successfullyPurchased.length);
            setRetryTransactions(failed);
        } catch (err) {
            console.error('Error during purchase:', err);
            setError(`There was an error processing your purchase: ${err}`);
        }

        setLoading(false);
    }, [
        publicKey,
        selectedBricks,
        signAllTransactions,
        checkBalance,
        setUploadTabEnabled,
        action,
        successMessage,
        endpoint,
    ]);

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

    React.useEffect(() => {
        setUploadTabEnabled(false);
    }, [
        selectedBricks,
        setUploadTabEnabled,
    ]);

    return (
        <div className="">
            <Card className="bg-[#333333] p-6 border border-[#C19A6B]">
                <CardHeader>
                    <CardTitle className="text-white">
                        Solana Payment
                    </CardTitle>
                    <CardDescription className="text-white">
                        {`Approve the transaction in your wallet
                        to ${action} your brick NFT(s)!`}
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
                        {`${costInSol} SOL`}
                    </div>

                    {loading && (
                        <div className="text-white">
                            {statusText}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-500">
                            {success}
                        </div>
                    )}

                    {successfulTransactions > 0 && !success && (
                        <div className="text-green-500">
                            {`${successfulTransactions} transactions completed successfully!`}
                        </div>
                    )}

                    {retryTransactions.length > 0 && (
                        <Button
                            className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[220px]"
                            onClick={() => handlePurchasePixels(retryTransactions)}
                        >
                            Retry Failed Transactions
                        </Button>
                    )}

                    {!publicKey && (
                        <WalletMultiButton/>
                    )}

                    {publicKey && !success && (
                        <Button
                            className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[220px]"
                            onClick={() => handlePurchasePixels()}
                            disabled={payButtonDisabled}
                        >
                            Pay
                        </Button>
                    )}

                    {success && (
                        <Button
                            className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[220px]"
                            onClick={handleNextTab}
                        >
                            Continue
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
