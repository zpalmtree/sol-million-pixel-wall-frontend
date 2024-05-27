"use client";

import React from 'react';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { toast } from 'react-toastify';

import { RPC } from '@/constants';

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const wallets = React.useMemo(() => [
        new SolflareWalletAdapter(),
    ], []);

    const onError = React.useCallback((err: any) => {
        const str = err.toString();

        const ignoreMessages = [
            'User rejected the request', // clicked cancel after approve pops up, phantom
            'Failed to sign transaction', // clicked cancel after approve pops up, solflare
            'WalletDisconnectedError', // disconnected wallet
            'WalletConnectionError', // didn't approve connect, solflare
        ];

        if (ignoreMessages.some((m) => str.includes(m))) {
            return;
        }

        console.log(`Caught error: ${err.toString()}`);
        console.log(err);
        toast.warn(`Wallet reported error: ${err.toString()}`);
    }, [
    ]);

    return (
        <>
            <ConnectionProvider endpoint={RPC}>
                <WalletProvider wallets={wallets} onError={onError} autoConnect>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
}
