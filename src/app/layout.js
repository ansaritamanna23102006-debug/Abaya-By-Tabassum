import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Abaya By Tabassum | Premium Luxury Modest Wear",
  description:
    "Experience timeless elegance and premium craftsmanship with Abaya By Tabassum. Explore our exclusive collections of everyday abayas, premium silk satins, and haute couture occasion wear.",
  keywords:
    "abaya, luxury abaya, modest fashion, premium abayas, designer abaya, Abaya by Tabassum, elegant modest wear",
  openGraph: {
    title: "Abaya By Tabassum | Premium Luxury Modest Wear",
    description:
      "Experience timeless elegance and premium craftsmanship. Discover everyday essentials and occasion wear crafted for grace, comfort, and modesty.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-deep text-primary-text font-sans">
        {/* Anti-flash script: runs before React hydrates to prevent white flash for dark mode users */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('abaya_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
