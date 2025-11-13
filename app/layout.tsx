import "./globals.css";

import { inter, poly } from "@/lib/fonts";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poly.variable} antialiased`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
