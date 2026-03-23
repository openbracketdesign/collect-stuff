import { type Metadata } from "next";
import "./tailwind.css";
import "./globals.css";

// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
// import { extractRouterConfig } from "uploadthing/server";
// import { ourFileRouter } from "./api/uploadthing/core";

import { ClerkProvider } from "@clerk/nextjs";
import { inter, space_grotesk } from "./fonts";

export const metadata: Metadata = {
  title: "Collectstuff",
  description: "Collect, manage and share your stuff",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}

        <body
          className={`font-sans ${inter.className} ${space_grotesk.variable} flex min-h-svh flex-col`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
