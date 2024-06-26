import { type ClassValue, clsx } from "clsx"
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSOL(lamports: number, significantDigits: number = 5) {
    return (lamports / LAMPORTS_PER_SOL).toFixed(significantDigits);
}

export function formatError(error: any) {
    console.log(error);

    if (typeof error === 'string') {
        return error;
    }

    if (error && error.InstructionError) {
        const message = error.InstructionError[1];
        return `Error: ${error.toString()}, custom message: ${message}`;
    }

    if (error.toString) {
        return error.toString();
    }

    return `Unknown Error: ${error}`;
}
