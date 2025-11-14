import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { inter, poly } from "@/lib/fonts";
import { generateMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/lib/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poly.variable} antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Header/>
          <main>
            {children}
          </main>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
