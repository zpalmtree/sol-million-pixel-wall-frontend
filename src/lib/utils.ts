import { type ClassValue, clsx } from "clsx"
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSOL(lamports: number, significantDigits: number = 3) {
    return (lamports / LAMPORTS_PER_SOL).toFixed(significantDigits);
}
