"use client";

import Link from "next/link";
import * as React from 'react';
import { useSetRecoilState } from 'recoil';

import { Header } from '@/components/header';
import { Button } from "@/components/ui/button";
import { PixelWall } from "@/components/pixelwall";
import { GradientLink } from '@/components/gradient-link';
import { TransparentLink } from '@/components/transparent-link';
import {
    currentTabState,
    uploadTabEnabledState,
} from '@/state/tabs';

export default function Splash() {
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

            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#1A1A1A] text-white">
                <main className="flex flex-col items-center justify-center flex-1 w-full mt-12">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary">
                                {`We're Building The Greatest WALL`}
                            </h1>
                            <div className='flex items-center justify-center w-full'>
                                <p className="max-w-[700px] text-[#EEEEEE] md:text-xl dark:text-[#EEEEEE] text-center">
                                    {`Explore the world's largest NFT-powered pixel wall where the dankest crypto communities collide on the blockchain. We're building the Wall - we have no choice.`}
                                </p>
                            </div>
                        </div>
                        <div className="space-x-4">
                            <GradientLink
                                href="/wall"
                                content="Explore the Wall"
                            />
                            <TransparentLink
                                href='#'
                                content='Learn More'
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-6 md:px-24 py-12 md:py-24 lg:py-32 bg-[#1A1A1A]">
                        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] w-full">
                            <div className="mx-auto flex justify-center rounded-xl border-2 border-primary object-center overflow-hidden lg:order-last">
                                <PixelWall
                                    interactable={false}
                                    width={350}
                                    height={350}
                                    selectedBricks={[]}
                                    setSelectedBricks={() => {}}
                                />
                            </div>
                            
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                        NFT Powered
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                        Unleash the Memes
                                    </h2>
                                    <p className="max-w-[600px] text-[#EEEEEE] md:text-lg/relaxed dark:text-[#EEEEEE]">
                                        Mint your own sections of the meme wall and contribute to the greatest WALL ever known! You will own this special digital real estate. Create and upload images to mog outrageously. Be a part of the legend. Become a legend. Nobody builds walls like we do. Nobody.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <GradientLink
                                        href='/purchase'
                                        content={'Mint an NFT'}
                                    />
                                    <TransparentLink
                                        href="#"
                                        content={'Learn More'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-[#1A1A1A] border-t border-primary">
                        <div className="flex flex-col items-center justify-center space-y-3 w-full">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                                Join the $WALL community!
                            </h2>

                            <div className='flex items-center justify-center w-full'>
                                <p className="text-center max-w-[600px] text-[#EEEEEE] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#EEEEEE]">
                                    {`They'll try to tell you the Wall divides us... but if you really think about it... the Wall unites us.`}
                                </p>
                            </div>
                            <Link href="https://twitter.com/WallOnSolana">
                                <Button
                                    className="bg-primary text-[#1A1A1A]"
                                    type="submit"
                                >
                                    Join us on Twitter
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <footer className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full px-4 md:px-6 py-6 border-t border-primary">
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
            </div>
        </>
    );
}
