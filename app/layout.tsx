import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.scss";
import RecoilContextProvider from "@/app/recoilContextProvider";
import MediaControls from "@/app/components/MediaControls/MediaControls";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Dan Photon",
    description: "Official website of music artist Dan Photon",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <RecoilContextProvider>
                    {children}
                    <MediaControls />
                </RecoilContextProvider>
            </body>
        </html>
    );
}
