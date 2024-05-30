"use client";

import Link from "next/link";
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { WalletMultiButton } from '@/components/wallet-button';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PixelWall } from "@/components/pixelwall";
import { selectedBricksState } from '@/state/bricks';
import { PRICE_PER_BRICK } from '@/constants';
import { formatSOL } from '@/lib/utils';
import { OwnedBricks } from '@/components/owned-bricks';

export default function Component() {
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

            <main className="flex flex-col md:flex-row min-h-[calc(100vh_-_theme(spacing.16))] bg-[#1a1a1a]">
                <OwnedBricks/>
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
        </>
    );
}

