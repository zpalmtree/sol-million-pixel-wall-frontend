"use client";

import Link from "next/link";
import * as React from 'react';

import { OwnedBricks } from '@/components/owned-bricks';
import { Header } from '@/components/header';

export default function Component() {
    return (
        <>
            <Header/>

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

