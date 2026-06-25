import { Playfair_Display, Inter } from "next/font/google";
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
