import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Juomalaskuri – Laske juhlien juomatarve",
  description: "Laske juhlien juomatarve ja vertaa hintoja Alko vs. Viro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className={cn("font-sans", figtree.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
