import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EWC Calgary — Empowerment Worship Centre",
    template: "%s | EWC Calgary",
  },
  description:
    "Empowerment Worship Centre Calgary — A Bible-believing church with a mandate to win souls and prepare them for the soon coming of Christ. Calgary Campus under the leadership of Prophet Gideon Danso.",
  keywords: [
    "EWC Calgary",
    "Empowerment Worship Centre",
    "Gideon Danso",
    "Calgary church",
    "Humphrey Lomotey",
    "EWC Canada",
    "church Calgary",
  ],
  manifest: "/manifest.json",
  themeColor: "#7B2D3B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EWC Calgary",
  },
  openGraph: {
    title: "EWC Calgary — Empowerment Worship Centre",
    description:
      "A Bible-believing church with a mandate to win souls. Calgary Campus of Empowerment Worship Centre.",
    siteName: "EWC Calgary",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const isCommunity = pathname.startsWith("/community");
  const isAppShell = isAdmin || isCommunity;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-body antialiased bg-ewc-snow text-ewc-charcoal`}
      >
        {!isAppShell && <Header />}
        <main className={!isAppShell ? "min-h-screen pt-20" : ""}>{children}</main>
        {!isAppShell && <Footer />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
