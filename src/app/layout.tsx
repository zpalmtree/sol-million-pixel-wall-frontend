import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { RecoilRootWrapper } from '@/wrappers/recoil-root-wrapper';
import { WalletWrapper } from '@/wrappers/wallet-wrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Million Pixel Wall",
    description: "The Million Pixel Wall by Wall On Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <RecoilRootWrapper>
                    <WalletWrapper>
                        {children}
                    </WalletWrapper>
                </RecoilRootWrapper>
            </body>
        </html>
    );
}
