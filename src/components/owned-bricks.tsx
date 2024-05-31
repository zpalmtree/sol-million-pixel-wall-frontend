import * as React from 'react';
import Link from "next/link";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import {
    useRecoilValue,
    useSetRecoilState,
    useRecoilState,
} from 'recoil';

import { WalletMultiButton } from '@/components/wallet-button';
import {
    ownedBricksWithArtState,
    ownedBricksWithoutArtState,
    ownedBricksState,
    selectedOwnedBricksWithArtState,
    selectedOwnedBricksWithoutArtState,
    selectedOwnedBricksWithArtSetState,
    selectedOwnedBricksWithoutArtSetState,
} from '@/state/bricks';
import {
    OwnedBrick,
} from '@/types/brick';
import {
    PRICE_PER_BRICK_UPDATE,
} from '@/constants';
import {
    formatSOL,
} from '@/lib/utils';

export function OwnedBricks() {
    const {
        publicKey,
    } = useWallet();

    const ownedBricksWithArt = useRecoilValue(ownedBricksWithArtState);
    const ownedBricksWithoutArt = useRecoilValue(ownedBricksWithoutArtState);
    const setOwnedBricks = useSetRecoilState(ownedBricksState);
    const selectedOwnedBricksWithArtSet = useRecoilValue(selectedOwnedBricksWithArtSetState);
    const selectedOwnedBricksWithoutArtSet = useRecoilValue(selectedOwnedBricksWithoutArtSetState);
    const [selectedOwnedBricksWithArt, setSelectedOwnedBricksWithArt] = useRecoilState(selectedOwnedBricksWithArtState);
    const [selectedOwnedBricksWithoutArt, setSelectedOwnedBricksWithoutArt] = useRecoilState(selectedOwnedBricksWithoutArtState);

    const bricksSelected = React.useMemo(() => {
        return selectedOwnedBricksWithArt.length + selectedOwnedBricksWithoutArt.length;
    }, [
        selectedOwnedBricksWithArt,
        selectedOwnedBricksWithoutArt,
    ]);

    const costInSol = React.useMemo(() => {
        const lamports = selectedOwnedBricksWithArt.length * PRICE_PER_BRICK_UPDATE;
        return formatSOL(lamports, 1);
    }, [
        selectedOwnedBricksWithArt,
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

    const handleBrickWithoutArtClicked = React.useCallback((b: OwnedBrick) => {
        const selected = selectedOwnedBricksWithoutArtSet.has(b.name);

        if (!selected && selectedOwnedBricksWithArt.length > 0) {
            toast.warn('Cannot update bricks without art and bricks with art at the same time. Please de-select bricks with art to continue.');
            return;
        }

        const newSelectedBricks = [];

        for (const brick of selectedOwnedBricksWithoutArt) {
            if (brick.name === b.name) {
                continue;
            }

            newSelectedBricks.push(brick);
        }

        if (!selected) {
            newSelectedBricks.push(b);
        }

        setSelectedOwnedBricksWithoutArt(newSelectedBricks);
    }, [
        selectedOwnedBricksWithArt,
        selectedOwnedBricksWithoutArt,
        setSelectedOwnedBricksWithoutArt,
    ]);

    const handleBrickWithArtClicked = React.useCallback((b: OwnedBrick) => {
        const selected = selectedOwnedBricksWithArtSet.has(b.name);

        if (!selected && selectedOwnedBricksWithoutArt.length > 0) {
            toast.warn('Cannot update bricks without art and bricks with art at the same time. Please de-select bricks with art to continue.');
            return;
        }

        const newSelectedBricks = [];

        for (const brick of selectedOwnedBricksWithArt) {
            if (brick.name === b.name) {
                continue;
            }

            newSelectedBricks.push(brick);
        }

        if (!selected) {
            newSelectedBricks.push(b);
        }

        setSelectedOwnedBricksWithArt(newSelectedBricks);

    }, [
        selectedOwnedBricksWithoutArt,
        selectedOwnedBricksWithArt,
        setSelectedOwnedBricksWithArt,
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
                    <h1 className="text-3xl font-bold mb-6 text-[#C19A6B]">
                        My Bricks
                    </h1>

                    <div className="flex flex-col gap-y-6">
                        <div className="mb-6 md:mr-6">
                            <h2 className="text-xl font-bold mb-3">
                                {`Missing art - upload for free (${ownedBricksWithoutArt.length})`}
                            </h2>
                            <div className="flex flex-wrap max-w-[900px] gap-x-6 gap-y-5">
                                {ownedBricksWithoutArt.map((b) => (
                                    <div
                                        className='relative'
                                        onClick={() => handleBrickWithoutArtClicked(b)}
                                    >
                                        <div
                                            key={b.name}
                                            className={`bg-[#2A2A2A] flex items-center justify-center rounded-md cursor-pointer hover:opacity-80 transition-opacity `}
                                        >
                                            <img
                                                alt={`Brick (${b.name})`}
                                                className="object-cover rounded-md"
                                                height={170}
                                                src={b.image}
                                                style={{
                                                    aspectRatio: "170/170",
                                                    objectFit: "cover",
                                                }}
                                                width={170}
                                            />
                                        </div>
                                        <div
                                            className={`opacity-80 absolute z-10 bottom-0 justify-center items-start bg-primary w-full h-full rounded-md cursor-pointer ${selectedOwnedBricksWithoutArtSet.has(b.name) ? 'flex' : 'hidden'}`}
                                        >
                                            <span className='text-white mt-4 text-xl'>
                                                Selected
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">
                                {`Already designed - update for a fee (${ownedBricksWithArt.length})`}
                            </h2>
                            <div className="flex flex-wrap max-w-[900px] gap-x-6 gap-y-5">
                                {ownedBricksWithArt.map((b) => (
                                    <div
                                        className='relative'
                                        onClick={() => handleBrickWithArtClicked(b)}
                                    >
                                        <div
                                            key={b.name}
                                            className={`bg-[#2A2A2A] flex items-center justify-center rounded-md cursor-pointer hover:opacity-80 transition-opacity `}
                                        >
                                            <img
                                                alt={`Brick (${b.name})`}
                                                className="object-cover rounded-md"
                                                height={170}
                                                src={b.image}
                                                style={{
                                                    aspectRatio: "170/170",
                                                    objectFit: "cover",
                                                }}
                                                width={170}
                                            />
                                        </div>
                                        <div
                                            className={`opacity-80 absolute z-10 bottom-0 justify-center items-start bg-primary w-full h-full rounded-md cursor-pointer ${selectedOwnedBricksWithArtSet.has(b.name) ? 'flex' : 'hidden'}`}
                                        >
                                            <span className='text-white mt-4 text-xl'>
                                                Selected
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-auto flex flex-col items-center mt-6 md:mt-0">
                    <div className="flex flex-col gap-3 rounded-lg bg-[#2A2A2A] p-4 w-[350px] xl:w-[370px] mx-auto relative border-l-4 border-primary">
                        <div className="flex items-center gap-x-3">
                            <span className="text-white">
                                Selected Bricks:
                            </span>{" "}
                            <span className="text-primary text-xl font-bold">
                                {bricksSelected}
                            </span>
                        </div>

                        <div className="flex items-center gap-x-3">
                            <span className="text-white">
                                Cost To Update Bricks:
                            </span>{" "}
                            <span className="text-primary text-xl font-bold">
                                {`${costInSol} SOL`}
                            </span>
                        </div>

                        <Link
                            className="inline-flex h-9 items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:text-primary border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
                            href={selectedOwnedBricksWithArt.length > 0 ? '/edit' : '/upload'}
                            style={{
                                pointerEvents: bricksSelected === 0 ? 'none' : 'auto',
                                opacity: bricksSelected === 0 ? '50%' : '100%',
                            }}
                        >
                            Continue
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

