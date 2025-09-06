import * as React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Assuming you still want to use Geist fonts
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Navbar from '@/components/Header/Navbar'; // Import the Navbar
import { Typography, Container, Box, Button } from '@mui/material';
import Link from 'next/link';
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
  title: "Rupeekx Clone", // Updated title
  description: "A clone of the Rupeekx website built with Next.js and Material-UI.", // Updated description
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
            <Navbar />
            <Container component="main" sx={{ flexGrow: 1, mt: 3, mb: 3 }}> {/* Added some margin top and bottom */}
              {children}
            </Container>
            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: 'auto', // Pushes footer to the bottom
                backgroundColor: '#f5f5f5', // Static color to avoid function in Server Component
                textAlign: 'center',
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary">
                  {'© '}
                  {new Date().getFullYear()}{' '}
                  Rupeekx Clone. All rights reserved. | 
                  <Link href="/privacy-policy">
                    <Button sx={{ color: 'text.secondary', ml: 0.5, textTransform: 'none'}}>Privacy Policy</Button>
                  </Link>
                   | 
                  <Link href="/terms-conditions">
                    <Button sx={{ color: 'text.secondary', ml: 0.5, textTransform: 'none'}}>Terms & Conditions</Button>
                  </Link>
                </Typography>
              </Container>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
