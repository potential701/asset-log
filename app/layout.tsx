import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asset Log",
  description: "A simple asset log for keeping track of warehouse assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="data-mode" defaultTheme="dark">
          <header>
            <Toaster position="top-right" theme="dark" />
          </header>
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
