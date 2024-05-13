/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QBKrD6hmfVm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Splash() {
    return (
        <>
            <header className="flex items-center justify-between bg-[#1a1a1a] px-6 py-4 shadow-md">
                <div className="flex items-center gap-8">
                    <Link
                        className="text-2xl font-bold tracking-tighter text-[#C19A6B]"
                        href="/"
                    >
                        The Million Pixel Wall
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            className="text-[#C19A6B] hover:text-white"
                            href="/"
                        >
                            Home
                        </Link>
                        <Link
                            className="text-[#C19A6B] hover:text-white"
                            href="/wall"
                        >
                            Explore the Wall
                        </Link>
                        <Link
                            className="text-[#C19A6B] hover:text-white"
                            href="/wall"
                        >
                            Buy Bricks
                        </Link>
                        <Link
                            className="text-[#C19A6B] hover:text-white"
                            href="/owned"
                        >
                            My Bricks
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        className="text-white hover:text-[#C19A6B] hover:bg-white/10 border border-[#C19A6B]"
                        size="sm"
                        variant="transparent"
                    >
                        Connect Wallet
                    </Button>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#1A1A1A] text-white">
                <main className="flex flex-col items-center justify-center flex-1 w-full mt-12">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#C19A6B]">
                                The Million Pixel Wall
                            </h1>
                            <p className="max-w-[700px] text-[#EEEEEE] md:text-xl dark:text-[#EEEEEE]">
                                Explore the world's largest NFT-powered pixel
                                wall, where creativity and community collide on
                                the Solana blockchain.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Link
                                className="inline-flex h-9 items-center justify-center rounded-md bg-[#C19A6B] px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-[#C19A6B]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19A6B] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#C19A6B] dark:text-[#1A1A1A] dark:hover:bg-[#C19A6B]/90 dark:focus-visible:ring-[#C19A6B]"
                                href="/wall"
                            >
                                Explore the Wall
                            </Link>
                            <Link
                                className="inline-flex h-9 items-center justify-center rounded-md border border-[#C19A6B] bg-[#1A1A1A] px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#1A1A1A]/90 hover:text-[#C19A6B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19A6B] disabled:pointer-events-none disabled:opacity-50 dark:border-[#C19A6B] dark:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A]/90 dark:hover:text-[#C19A6B] dark:focus-visible:ring-[#C19A6B]"
                                href=""
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-6 md:px-12 py-12 md:py-24 lg:py-32 bg-[#1A1A1A]">
                        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] w-full">
                            <img
                                alt="Image"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                                height="310"
                                src="/placeholder.svg"
                                width="550"
                            />
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <div className="inline-block rounded-lg bg-[#C19A6B] px-3 py-1 text-sm text-[#1A1A1A]">
                                        NFT Powered
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#C19A6B]">
                                        Unleash Your Creativity
                                    </h2>
                                    <p className="max-w-[600px] text-[#EEEEEE] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#EEEEEE]">
                                        Mint your own sections of the million
                                        pixel wall and contribute to the
                                        ever-evolving Million Pixel Wall.
                                        Showcase your talent as your creations
                                        gain popularity.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#C19A6B] px-8 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-[#C19A6B]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19A6B] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#C19A6B] dark:text-[#1A1A1A] dark:hover:bg-[#C19A6B]/90 dark:focus-visible:ring-[#C19A6B]"
                                        href="#"
                                    >
                                        Mint an NFT
                                    </Link>
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-[#C19A6B] bg-[#1A1A1A] px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#1A1A1A]/90 hover:text-[#C19A6B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19A6B] disabled:pointer-events-none disabled:opacity-50 dark:border-[#C19A6B] dark:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A]/90 dark:hover:text-[#C19A6B] dark:focus-visible:ring-[#C19A6B]"
                                        href="#"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-[#1A1A1A] border-t border-[#C19A6B]">
                        <div className="flex flex-col items-center justify-center space-y-3 w-full">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-[#C19A6B]">
                                Join the Million Pixel Wall Community
                            </h2>
                            <p className="max-w-[600px] text-[#EEEEEE] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-[#EEEEEE]">
                                Become a part of the vibrant community of pixel
                                artists and collectors shaping the future of the
                                Million Pixel Wall.
                            </p>
                            <a href="https://twitter.com/WallOnSolana">
                                <Button
                                    className="bg-[#C19A6B] text-[#1A1A1A]"
                                    type="submit"
                                >
                                    Join us on Twitter
                                </Button>
                            </a>
                        </div>
                    </div>
                </main>
                <footer className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full px-4 md:px-6 py-6 border-t border-[#C19A6B]">
                    <p className="text-xs text-[#EEEEEE] dark:text-[#EEEEEE]">
                        © 2024 Wall On Solana. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link
                            className="text-xs hover:underline underline-offset-4 text-[#C19A6B]"
                            href="https://twitter.com/WallOnSolana"
                        >
                            Twitter
                        </Link>
                        <Link
                            className="text-xs hover:underline underline-offset-4 text-[#C19A6B]"
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

function ImageIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
}
