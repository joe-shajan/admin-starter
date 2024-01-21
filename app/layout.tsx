import Header from "@/components/Header";
import "./globals.css";

import QueryClientProvider from "@/utils/provider";
import React from "react";
import Provider from "./context/client-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "@/redux/provider";

export const metadata = {
  title: "Inventory management",
  description: "Manage your shop and inventory",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
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
