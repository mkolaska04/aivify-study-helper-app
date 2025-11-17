import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "Aivify",
  description: "Aivify Study Helper App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-background" >
        <Providers>
          <div className="  ">
            <NavBar />
            <main className="">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
