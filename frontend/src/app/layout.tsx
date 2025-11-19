import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

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
            <main className="min-h-screen flex flex-col justify-between pt-14">
              {children}
              <Footer />
            </main>
          
          </div>
        </Providers>
      </body>
    </html>
  );
}
