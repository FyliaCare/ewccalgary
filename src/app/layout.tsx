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

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-body antialiased bg-ewc-snow text-ewc-charcoal`}
      >
        {!isAdmin && <Header />}
        <main className={!isAdmin ? "min-h-screen pt-20" : ""}>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
