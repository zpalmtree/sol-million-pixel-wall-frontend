import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PixelWall } from "@/components/pixelwall";
import { WalletMultiButton } from '@/components/wallet-button';

export default function Splash() {
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

            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#1A1A1A] text-white">
                <main className="flex flex-col items-center justify-center flex-1 w-full mt-12">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary">
                                We're Building The Greatest WALL
                            </h1>
                            <div className='flex items-center justify-center w-full'>
                                <p className="max-w-[700px] text-[#EEEEEE] md:text-xl dark:text-[#EEEEEE]">
                                    {`Explore the world's largest NFT-powered pixel wall where the dankest crypto communities collide on the blockchain. We're building the Wall - we have no choice.`}
                                </p>
                            </div>
                        </div>
                        <div className="space-x-4">
                            <Link
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-[#1A1A1A] dark:hover:bg-primary/90 dark:focus-visible:ring-primary"
                                href="/wall"
                            >
                                Explore the Wall
                            </Link>
                            <Link
                                className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-[#1A1A1A] px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#1A1A1A]/90 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:border-primary dark:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A]/90 dark:hover:text-primary dark:focus-visible:ring-primary"
                                href=""
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-6 md:px-24 py-12 md:py-24 lg:py-32 bg-[#1A1A1A]">
                        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] w-full">
                            <div className="mx-auto flex justify-center rounded-xl border-2 border-primary object-center overflow-hidden lg:order-last">
                                <PixelWall
                                    interactable={false}
                                    width={350}
                                    height={350}
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
                                        Mint your own sections of the million pixel wall and contribute to the greatest WALL ever known! You will own this special digital real estate. Create and upload images to mog outrageously. Be a part of the legend. Become a legend. Nobody builds walls like we do. Nobody.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-[#1A1A1A] dark:hover:bg-primary/90 dark:focus-visible:ring-primary"
                                        href="#"
                                    >
                                        Mint an NFT
                                    </Link>
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-[#1A1A1A] px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#1A1A1A]/90 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:border-primary dark:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A]/90 dark:hover:text-primary dark:focus-visible:ring-primary"
                                        href="#"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-[#1A1A1A] border-t border-primary">
                        <div className="flex flex-col items-center justify-center space-y-3 w-full">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">
                                Join the Million Pixel Wall Community
                            </h2>
                            <p className="max-w-[600px] text-[#EEEEEE] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#EEEEEE]">
                                Become a part of the vibrant community of pixel
                                artists and collectors shaping the future of the
                                Million Pixel Wall.
                            </p>
                            <a href="https://twitter.com/WallOnSolana">
                                <Button
                                    className="bg-primary text-[#1A1A1A]"
                                    type="submit"
                                >
                                    Join us on Twitter
                                </Button>
                            </a>
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
