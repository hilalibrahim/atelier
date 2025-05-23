import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from '../../components/SmoothScroll';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Atelier Republic',
  description: 'Architecture and Design Studio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll>
        {children}
        </SmoothScroll>
        
      </body>
    </html>
  );
}
