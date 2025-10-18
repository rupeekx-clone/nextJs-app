import * as React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Box } from '@mui/material';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optional: Improves font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optional: Improves font loading
});

export const metadata: Metadata = {
  title: "Blumiq", // Updated title
  description: "A comprehensive digital platform for facilitating personal and business loan applications through multiple bank partnerships.", // Updated description
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
