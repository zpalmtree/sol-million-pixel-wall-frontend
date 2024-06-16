import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Header } from '@/components/header';

export default function Component() {
    return (
        <>
            <Header />

            <main className="flex items-start justify-center min-h-[calc(100vh_-_theme(spacing.16))] bg-[#1a1a1a] py-8 px-8 gap-x-4 gap-y-4 flex-row flex-wrap">
                <section className="py-16 md:py-28">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-5">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                    How It Works
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                    How the Meme Wall Works
                                </h2>
                                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    {`Explore the world's largest NFT-powered
                                    pixel wall where the dankest crypto
                                    communities collide on the blockchain.
                                    You own this special piece of digital
                                    real estate represented by a brick in
                                    the section of the Wall and are issued a
                                    respective NFT. When a brick is
                                    purchased, Solana is used to buy back
                                    and burn $WALL. Funds are also used to
                                    provide liquidity in the Solana pairs,
                                    cover admin expenses, giveaways and
                                    community marketing.`}
                                </p>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-2">
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <UploadIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        1) Purchase Brick NFTs
                                    </h3>
                                    <p className="text-white">
                                        Users can purchase brick NFTs that
                                        let them control that space in the
                                        wall and upload images.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <DiscIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        2) Upload Memes
                                    </h3>
                                    <p className="text-white">
                                        Design and upload the dankest memes in your corner of the meme wall.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-28 lg:py-36 bg-[#1A1A1A]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-5">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                    Funds Allocation
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                    Funds Allocation
                                </h2>
                                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    The funds raised through the Meme Wall
                                    project will be utilized to support
                                    various initiatives aimed at enhancing
                                    the project and its community. A portion
                                    of the funds will be used to buy back
                                    and burn the $WALL token.
                                </p>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-3">
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <CurrencyIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Liquidity
                                    </h3>
                                    <p className="text-white">
                                        A portion of the funds will be used
                                        to provide liquidity for the
                                        project&apos;s token, ensuring a
                                        healthy and stable market.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <StoreIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Community Marketing
                                    </h3>
                                    <p className="text-white">
                                        Funds will be allocated towards
                                        marketing efforts to raise awareness
                                        about the project and attract more
                                        contributors and supporters.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <ActivityIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Development
                                    </h3>
                                    <p className="text-white">
                                        A portion of the funds will be
                                        dedicated to the ongoing development
                                        and improvement of the Meme Wall
                                        project, including new features and
                                        functionalities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-28 lg:py-36 bg-[#1A1A1A]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-5">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                    Donation Address
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                    Donation Address
                                </h2>
                                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    To support the Meme Wall project and
                                    contribute to its growth, you can donate
                                    to the following address:
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-6">
                                <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 rounded-lg">
                                    <WalletIcon className="h-6 w-6 text-[#1A1A1A]" />
                                    <span className="text-lg font-mono text-[#1A1A1A]">
                                        0x1234567890abcdef
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-28 lg:py-36 bg-[#1A1A1A]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-5">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                    Stretch Goals
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                    Stretch Goals
                                </h2>
                                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    If sufficient funds are raised, the Meme
                                    Wall project aims to implement the
                                    following additional features and
                                    functionalities:
                                </p>
                            </div>
                            <div className="grid gap-8 lg:grid-cols-3">
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <TicketIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Lottos for the Strongest Memecoin
                                        Communities
                                    </h3>
                                    <p className="text-white">
                                        Introduce lottery-style events for
                                        the strongest memecoin communities,
                                        allowing them to compete for
                                        exclusive prizes and rewards.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <HotelIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Rental Agreements for High Value
                                        Wall Real Estate
                                    </h3>
                                    <p className="text-white">
                                        Implement rental agreements for
                                        high-value wall real estate,
                                        enabling users to temporarily lease
                                        prime locations on the Meme Wall.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <SubscriptIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Subreddits for Each Pixel
                                    </h3>
                                    <p className="text-white">
                                        Create dedicated subreddits for each
                                        pixel on the Meme Wall, fostering
                                        community discussions and
                                        collaborations around specific wall
                                        sections.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-6 mt-8">
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <CurrencyIcon className="h-12 w-12 text-white" />
                                    <h3 className="text-xl font-bold text-primary">
                                        Integrated Brick Exchange
                                    </h3>
                                    <p className="text-white">
                                        Implement an integrated brick
                                        exchange platform, allowing users to
                                        trade and exchange their wall real
                                        estate with others.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-16 md:py-28 lg:py-36 bg-[#1A1A1A]">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="space-y-5">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-[#1A1A1A]">
                                    Stay Connected
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                                    Social Links
                                </h2>
                                <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Stay connected with the Meme Wall
                                    community and join the conversation on
                                    our various social media channels:
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="https://twitter.com/WallOnSolana">
                                    <Button
                                        className="bg-primary text-[#1A1A1A]"
                                        type="submit"
                                    >
                                        Twitter
                                    </Button>
                                </Link>

                                <Link href="https://t.me/wallonsolana">
                                    <Button
                                        className="bg-primary text-[#1A1A1A]"
                                        type="submit"
                                    >
                                        Telegram
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
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

function ActivityIcon(props: any) {
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
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
    );
}

function CurrencyIcon(props: any) {
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
            <circle cx="12" cy="12" r="8" />
            <line x1="3" x2="6" y1="3" y2="6" />
            <line x1="21" x2="18" y1="3" y2="6" />
            <line x1="3" x2="6" y1="21" y2="18" />
            <line x1="21" x2="18" y1="21" y2="18" />
        </svg>
    );
}

function DiscIcon(props: any) {
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

function HotelIcon(props: any) {
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
            <path d="M10 22v-6.57" />
            <path d="M12 11h.01" />
            <path d="M12 7h.01" />
            <path d="M14 15.43V22" />
            <path d="M15 16a5 5 0 0 0-6 0" />
            <path d="M16 11h.01" />
            <path d="M16 7h.01" />
            <path d="M8 11h.01" />
            <path d="M8 7h.01" />
            <rect x="4" y="2" width="16" height="20" rx="2" />
        </svg>
    );
}

function StoreIcon(props: any) {
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
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    );
}

function SubscriptIcon(props: any) {
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
            <path d="m4 5 8 8" />
            <path d="m12 5-8 8" />
            <path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07" />
        </svg>
    );
}

function TicketIcon(props: any) {
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
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
        </svg>
    );
}

function UploadIcon(props: any) {
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}

function WalletIcon(props: any) {
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
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
    );
}
