import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { inter, space_grotesk } from "./fonts";
import "./globals.css";
import "./tailwind.css";

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
      <TooltipProvider>
        <html lang="en">
          {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}

          <body
            className={`font-sans ${inter.className} ${space_grotesk.variable} flex min-h-svh flex-col`}
          >
            {children}
          </body>
        </html>
      </TooltipProvider>
    </ClerkProvider>
  );
}
