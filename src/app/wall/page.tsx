"use client";

import Link from "next/link";
import Image from 'next/image';
import * as React from 'react';
import {
    useSetRecoilState,
    useRecoilState,
} from 'recoil';
import {
    currentTabState,
    uploadTabEnabledState,
} from '@/state/tabs';

import { PixelWall } from "@/components/pixelwall";
import {
    selectedBricksState,
} from '@/state/bricks';
import { Header } from '@/components/header';

export default function Component() {
    const [selectedBricks, setSelectedBricks] = useRecoilState(selectedBricksState);
    const setCurrentTab = useSetRecoilState(currentTabState);
    const setUploadTabEnabled = useSetRecoilState(uploadTabEnabledState);

    React.useEffect(() => {
        setCurrentTab('create');
        setUploadTabEnabled(false);
    }, [
        setCurrentTab,
        setUploadTabEnabled,
    ]);

    return (
        <>
            <Header/>

            <main className="flex items-start justify-center min-h-[calc(100vh_-_theme(spacing.16))] bg-[#1a1a1a] py-8 px-8 gap-x-4 gap-y-4 flex-row flex-wrap">
                <div className="flex justify-center border-2 border-primary">
                    <PixelWall
                        interactable={true}
                        selectedBricks={selectedBricks}
                        setSelectedBricks={setSelectedBricks}
                        height={1000}
                        width={1000}
                        permitBrickSelection={false}
                    />
                </div>

                <div className='flex-col flex gap-y-4 gap-x-4'>
                    <Image
                        alt={'trump pepe'}
                        src={'/trump.png'}
                        className={'rounded border-2 border-primary'}
                        width={600}
                        height={592}
                    />

                    <span className='text-xl text-primary font-bold tracking-tighter'>
                        {`We're building the f^*king WALL!`}
                    </span>

                    <span className='text-white'>
                        Note: You can scroll with mouse wheel, and pan by holding down right mouse.
                    </span>

                    <span className='text-white'>
                        {`Want to buy a brick? Head to the 'Buy Bricks' page.`}
                    </span>
                </div>
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

