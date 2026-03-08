import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
