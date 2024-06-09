"use client";

import Link from "next/link";
import Image from 'next/image';

import { WalletMultiButton } from '@/components/wallet-button';

export function Header() {
    return (
        <header className="flex items-center justify-between bg-[#1a1a1a] px-6 py-4 shadow-md">
            <div className="flex items-center gap-8">
                <Link
                    className="text-lg md:text-2xl font-bold tracking-tighter gradient-text"
                    href="/"
                >
                    The Million Pixel Wall
                </Link>

                <Image
                    alt={'apu pepe'}
                    src={'/apu.png'}
                    className='-ml-2 -mr-3 hidden md:flex'
                    width={45}
                    height={45}
                />

                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        className="gradient-text hover:text-white"
                        href="/"
                    >
                        Home
                    </Link>
                    <Link
                        className="gradient-text hover:text-white"
                        href="/wall"
                    >
                        Explore the Wall
                    </Link>
                    <Link
                        className="gradient-text hover:text-white"
                        href="/purchase"
                    >
                        Buy Bricks
                    </Link>
                    <Link
                        className="gradient-text hover:text-white"
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
    );
}
