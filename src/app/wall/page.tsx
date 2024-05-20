"use client";

import Link from "next/link";
import * as React from 'react';
import { useRecoilValue } from 'recoil';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PixelWall } from "@/components/pixelwall";
import { Dialog } from "@/components/ui/dialog";
import { CheckoutDialog } from '@/components/checkout';
import { selectedBricksState } from '@/state/bricks';
import { PRICE_PER_BRICK } from '@/constants';
import { formatSOL } from '@/lib/utils';

export default function Component() {
    const selectedBricks = useRecoilValue(selectedBricksState);

    const [ checkoutDialogOpen, setCheckoutDialogOpen ] = React.useState<boolean>(false);

    const costInSol = React.useMemo(() => {
        const lamports = selectedBricks.length * PRICE_PER_BRICK;
        return formatSOL(lamports, 1);
    }, [
        selectedBricks,
    ]);

    const handleCheckout = React.useCallback(() => {
        setCheckoutDialogOpen(true);
    }, [
        setCheckoutDialogOpen,
    ]);

    return (
        <>
            <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
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
                            variant="transparent"
                        >
                            Connect Wallet
                        </Button>
                    </div>
                </header>

                <main className="flex flex-col md:flex-row min-h-[calc(100vh_-_theme(spacing.16))] bg-[#1a1a1a]">
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-3 sm:px-4 md:px-0">
                        <section className="w-full md:py-24 dark bg-[#1A1A1A]">
                            <div className="container flex flex-wrap w-full items-center justify-center gap-4 sm:px-4 md:px-6 xl:gap-12">
                                <div className="container flex flex-wrap w-full items-center justify-center gap-4 xl:gap-12">
                                    <div className="flex justify-center border-2 border-primary">
                                        <PixelWall
                                            interactable={true}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 xl:gap-6 h-[600px]">
                                        <div className="flex flex-col gap-3 rounded-lg bg-[#2A2A2A] p-4 w-[350px] xl:w-[370px] mx-auto relative border-l-4 border-primary">
                                            <div className="flex items-center gap-x-3">
                                                <span className="text-white">
                                                    Selected Bricks:
                                                </span>{" "}
                                                <span className="text-primary text-xl font-bold">
                                                    {selectedBricks.length}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <span className="text-white">
                                                    Cost of Selected Bricks:
                                                </span>{" "}
                                                <span className="text-primary text-xl font-bold">
                                                    {`${costInSol} SOL`}
                                                </span>
                                            </div>

                                            <Link
                                                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:text-primary border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
                                                href="/checkout"
                                                style={{
                                                    pointerEvents: selectedBricks.length === 0 ? 'none' : 'auto',
                                                    opacity: selectedBricks.length === 0 ? '50%' : '100%',
                                                }}
                                            >
                                                Continue
                                            </Link>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 h-full">
                                            <div className="flex flex-col gap-4 rounded-lg bg-[#2d2d2d] p-4 w-[350px] xl:w-[370px] relative border-l-4 border-primary">
                                                <p className="text-primary text-bold text-lg tracking-tighter">
                                                    Elevate Your Digital Presence on the Ultimate Canvas
                                                </p>
                                                <p className="text-gray-300">
                                                    The Million Pixel Wall - a groundbreaking NFT spectacle set on the Solana blockchain.
                                                </p>
                                                <p className="text-gray-300">
                                                    With each brick spanning a 10x10 pixel area, you have the opportunity to own a piece of this monumental project. Navigate through the expanse, select your territory, and purchase the corresponding NFTs to stake your claim.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="flex flex-col gap-2 rounded-lg bg-[#2d2d2d] p-4 w-[350px] relative border-l-4 border-primary">
                                        <p className="text-primary text-bold text-lg tracking-tighter">
                                            Unleash Boundless Creativity
                                        </p>
                                        <p className="text-gray-300">
                                            Transform your section of the wall as your vision evolves.
                                        </p>
                                        <p className="text-gray-300">
                                            Your bricks serve as a dynamic canvas for your creativity. Want to update your image or message? You can, for a nominal fee, ensuring your creative expression is never static.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 rounded-lg bg-[#2d2d2d] p-4 w-[350px] relative border-l-4 border-primary">
                                        <p className="text-primary text-bold text-lg tracking-tighter">
                                            Capture Prime Digital Real Estate
                                        </p>

                                        <p className="text-gray-300">
                                            In the realm of the Solana Million Pixel Wall, location is everything.
                                        </p>
                                        <p className="text-gray-300">
                                            {`Secure the most sought-after sections before they're claimed. The early bird doesn't just get the worm; it gets to dictate the aesthetic and cultural heart of this digital masterpiece.`}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 rounded-lg bg-[#2d2d2d] p-4 w-[350px] relative border-l-4 border-primary">
                                        <p className="text-primary text-bold text-lg tracking-tighter">
                                            Be Part of a Growing Masterpiece
                                        </p>

                                        <p className="text-gray-300">
                                            As each collaborator adds their unique flair, the Million Pixel Wall evolves - a living, breathing mosaic of digital art.
                                        </p>

                                        <p className="text-gray-300">
                                            Your contributions are immortalized in this shared space, as the wall develops into an emblem of communal creation and innovation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="w-full md:w-80 bg-[#1a1a1a] border-l border-[#2d2d2d] p-4 pb-6 sm:p-6 flex flex-col gap-6">
                        <Separator
                            className='bg-[#2d2d2d] dark:bg-[#2d2d2d] md:hidden'
                        />

                        <div>
                            <h2 className="text-xl font-bold text-primary mb-2">
                                My Bricks
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Button
                                    size="sm"
                                    variant="transparent"
                                >
                                    View Owned Bricks
                                </Button>
                                <Button
                                    size="sm"
                                    variant="transparent"
                                >
                                    Edit Owned Bricks
                                </Button>
                            </div>
                        </div>
                    </div>

                    <CheckoutDialog/>
                </main>

                <footer className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full px-4 md:px-6 py-6 border-t border-primary bg-[#1A1A1A]">
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
            </Dialog>
        </>
    );
}

