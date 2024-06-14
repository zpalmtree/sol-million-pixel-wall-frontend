"use client";

import Link from "next/link";
import Image from 'next/image';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { audioElementState, isPlayingState } from '@/state/audio';

import { WalletMultiButton } from '@/components/wallet-button';

export function Header() {
    const audio = useRecoilValue(audioElementState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    React.useEffect(() => {
        const handleUserInteraction = () => {
            if (audio && !isPlaying) {
                audio.play();
                setIsPlaying(true);

                // Remove event listeners after the first interaction
                window.removeEventListener('click', handleUserInteraction);
                window.removeEventListener('keydown', handleUserInteraction);
            }
        };

        window.addEventListener('click', handleUserInteraction, { once: true });
        window.addEventListener('keydown', handleUserInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
    ]);

    const toggleMusic = React.useCallback(() => {
        if (audio) {
            if (isPlaying) {
                console.log('Pausing music');
                audio.pause();
            } else {
                console.log('Playing music');
                audio.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            console.log('audio is null');
        }
    }, [audio, isPlaying, setIsPlaying]);

    return (
        <header className="flex items-center justify-between bg-[#1a1a1a] px-6 py-4 shadow-md">
            <div className="flex items-center gap-8">
                <Link
                    className="text-lg md:text-2xl font-bold tracking-tighter gradient-text"
                    href="/"
                >
                    The Meme Wall
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
                <button 
                    onClick={toggleMusic} 
                    className="gradient-text hover:text-white focus:outline-none"
                >
                    {isPlaying ? 'Pause Music' : 'Play Music'}
                </button>

                <WalletMultiButton />
            </div>
        </header>
    );
}

