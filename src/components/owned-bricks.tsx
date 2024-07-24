import * as React from 'react';
import Link from "next/link";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import {
    useRecoilValue,
    useSetRecoilState,
    useRecoilState,
} from 'recoil';

import { Button } from "@/components/ui/button";
import { WalletMultiButton } from '@/components/wallet-button';
import {
    ownedBricksWithArtState,
    ownedBricksWithoutArtState,
    ownedBricksState,
    selectedOwnedBricksWithArtState,
    selectedOwnedBricksWithoutArtState,
} from '@/state/bricks';
import {
    formatSOL,
} from '@/lib/utils';
import {
    pricePerBrickEditState,
} from '@/state/purchase';
import { PixelWall } from '@/components/pixelwall';

export function OwnedBricks() {
    const {
        publicKey,
    } = useWallet();

    const ownedBricksWithArt = useRecoilValue(ownedBricksWithArtState);
    const ownedBricksWithoutArt = useRecoilValue(ownedBricksWithoutArtState);
    const setOwnedBricks = useSetRecoilState(ownedBricksState);
    const [selectedOwnedBricksWithArt, setSelectedOwnedBricksWithArt] = useRecoilState(selectedOwnedBricksWithArtState);
    const [selectedOwnedBricksWithoutArt, setSelectedOwnedBricksWithoutArt] = useRecoilState(selectedOwnedBricksWithoutArtState);
    const pricePerBrickEdit = useRecoilValue(pricePerBrickEditState);

    const artCostInSol = React.useMemo(() => {
        const lamports = selectedOwnedBricksWithArt.length * pricePerBrickEdit;
        return formatSOL(lamports, 3);
    }, [
        selectedOwnedBricksWithArt.length,
        pricePerBrickEdit,
    ]);

    const handleClearSelectedOwnedBricksWithArt = React.useCallback(() => {
        setSelectedOwnedBricksWithArt([]);
    }, [
        setSelectedOwnedBricksWithArt,
    ]);

    const handleClearSelectedOwnedBricksWithoutArt = React.useCallback(() => {
        setSelectedOwnedBricksWithoutArt([]);
    }, [
        setSelectedOwnedBricksWithoutArt,
    ]);

    const fetchOwnedBricks = React.useCallback(async () => {
        if (!publicKey) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/owned`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    solAddress: publicKey.toString(),
                }),
            });

            const data = await response.json();

            if (data.error) {
                toast.error(`Failed to fetch owned bricks: ${data.error}`);
            } else {
                setOwnedBricks(data.bricks);
            }
        } catch (err) {
            toast.error(`Failed to fetch owned bricks: ${err}`);
        }
    }, [
        publicKey,
        setOwnedBricks,
    ]);

    React.useEffect(() => {
        fetchOwnedBricks();
    }, [
        publicKey,
        fetchOwnedBricks,
    ]);

    if (!publicKey) {
        return (
            <div className="bg-[#1a1a1a] text-white rounded-lg flex flex-wrap mt-16 gap-4 sm:px-4 md:px-6 xl:gap-12">
                <div className="mx-auto gap-x-28 px-4 py-6 flex flex-col gap-y-6 border-l-4 border-primary bg-[#2d2d2d] rounded-lg h-min">
                    <span>
                        To view your owned bricks, connect your wallet.
                    </span>

                    <WalletMultiButton/>
                </div>
            </div>

        );
    }

    return (
        <div className="bg-[#1a1a1a] text-white rounded-lg flex flex-wrap w-full mt-16 justify-center gap-4 sm:px-4 md:px-6 xl:gap-12">
            <div className="mx-auto gap-x-28 px-4 py-8 flex flex-col md:flex-row">
                <div>
                    <h1 className="text-3xl font-bold mb-6 text-primary">
                        My Bricks
                    </h1>

                    <div className="flex flex-col gap-y-6">
                        <div className="mb-6 flex flex-col items-start justify-start gap-y-5">
                            <h2 className="text-xl font-bold">
                                {`Missing art - upload for free (${ownedBricksWithoutArt.length})`}
                            </h2>

                            <div className="flex justify-center rounded-xl border-2 border-primary object-center overflow-hidden w-min">
                                <PixelWall
                                    interactable={true}
                                    selectedBricks={selectedOwnedBricksWithoutArt}
                                    setSelectedBricks={setSelectedOwnedBricksWithoutArt}
                                    availableBricks={ownedBricksWithoutArt}
                                    highlightAvailableBricks={true}
                                    zoomToAvailableBricks={true}
                                />
                            </div>

                            <div className="flex flex-col gap-3 rounded-lg bg-[#2A2A2A] p-4 w-[350px] xl:w-[380px] border-l-4 border-primary">
                                <div className="flex items-center gap-x-3">
                                    <span className="text-white">
                                        Selected Bricks:
                                    </span>{" "}
                                    <span className="text-primary text-xl font-bold">
                                        {selectedOwnedBricksWithoutArt.length}
                                    </span>
                                </div>

                                <div className="flex items-center gap-x-3">
                                    <span className="text-white">
                                        Cost To Update Bricks:
                                    </span>{" "}
                                    <span className="text-primary text-xl font-bold">
                                        Free!
                                    </span>
                                </div>

                                <Button
                                    className="w-full h-9"
                                    onClick={handleClearSelectedOwnedBricksWithoutArt}
                                    disabled={selectedOwnedBricksWithoutArt.length === 0}
                                >
                                    Clear Selected Bricks
                                </Button>

                                <Link
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:text-primary border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
                                    href={'/upload'}
                                    style={{
                                        pointerEvents: selectedOwnedBricksWithoutArt.length === 0 ? 'none' : 'auto',
                                        opacity: selectedOwnedBricksWithoutArt.length === 0 ? '50%' : '100%',
                                    }}
                                >
                                    Continue
                                </Link>
                            </div>

                            <span className='text-white text-wrap max-w-[600px]'>
                                Note: Bricks you own are highlighted in blue. Select the bricks you wish to update.
                            </span>
                        </div>
                        <div className="mb-6 flex flex-col items-start justify-start gap-y-5">
                            <h2 className="text-xl font-bold mb-3">
                                {`Already designed - update for a fee (${ownedBricksWithArt.length})`}
                            </h2>
                            <div className="flex justify-center rounded-xl border-2 border-primary object-center overflow-hidden w-min">
                                <PixelWall
                                    interactable={true}
                                    selectedBricks={selectedOwnedBricksWithArt}
                                    setSelectedBricks={setSelectedOwnedBricksWithArt}
                                    availableBricks={ownedBricksWithArt}
                                    highlightAvailableBricks={true}
                                    zoomToAvailableBricks={true}
                                />
                            </div>

                            <div className="flex flex-col gap-3 rounded-lg bg-[#2A2A2A] p-4 w-[350px] xl:w-[380px] border-l-4 border-primary">
                                <div className="flex items-center gap-x-3">
                                    <span className="text-white">
                                        Selected Bricks:
                                    </span>{" "}
                                    <span className="text-primary text-xl font-bold">
                                        {selectedOwnedBricksWithArt.length}
                                    </span>
                                </div>

                                <div className="flex items-center gap-x-3">
                                    <span className="text-white">
                                        Cost To Update Bricks:
                                    </span>{" "}
                                    <span className="text-primary text-xl font-bold">
                                        {`${artCostInSol} SOL`}
                                    </span>
                                </div>

                                <Button
                                    className="w-full h-9"
                                    onClick={handleClearSelectedOwnedBricksWithArt}
                                    disabled={selectedOwnedBricksWithArt.length === 0}
                                >
                                    Clear Selected Bricks
                                </Button>

                                <Link
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:text-primary border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
                                    href={'/edit'}
                                    style={{
                                        pointerEvents: selectedOwnedBricksWithArt.length === 0 ? 'none' : 'auto',
                                        opacity: selectedOwnedBricksWithArt.length === 0 ? '50%' : '100%',
                                    }}
                                >
                                    Continue
                                </Link>
                            </div>


                            <span className='text-white text-wrap mt-4 max-w-[600px]'>
                                Note: Bricks you own are highlighted in blue. Select the bricks you wish to update.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

