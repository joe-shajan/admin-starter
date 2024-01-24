import Header from "@/components/Header";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import QueryClientProvider from "@/utils/provider";
import React from "react";
import Provider from "../context/client-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "@/redux/provider";

export const metadata = {
  title: "Admin",
  description: "Manage your website",
};

import { cn } from "@/lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider session={session}>
          <QueryClientProvider>
            <Providers>
              <Header />
              {children}
            </Providers>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
