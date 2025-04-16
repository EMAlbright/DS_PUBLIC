import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import { HeadBanner } from "./components/statics/banner/header";
import { JSONProvider } from "@/src/context/JSONContext";
import { ProjectProvider } from "@/src/context/projectContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryProvider } from "@/src/providers/queryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataSmith",
  description: "Data To API",
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* react query */}
        <ReactQueryProvider>
        {/* global auth for user*/}
        <AuthProvider>
          < HeadBanner />
          {/** project user in */}
          <ProjectProvider>
          {/* global JSON data from user */}
          <JSONProvider>
          {children}
          </JSONProvider>
          </ProjectProvider>
        </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
