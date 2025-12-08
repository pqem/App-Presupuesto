import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StorageProvider } from "@/context/StorageContext";
import { UiProvider } from "@/context/UiContext";
import SwipeNavigation from "@/components/SwipeNavigation";
import FloatingActionButton from "@/components/FloatingActionButton";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8b5cf6",
};

export const metadata: Metadata = {
  title: "Presupuesto Familiar",
  description: "Gestión inteligente de finanzas familiares",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Presupuesto",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <StorageProvider>
          <UiProvider>
            <SwipeNavigation>
              {children}
            </SwipeNavigation>
            <FloatingActionButton />
          </UiProvider>
        </StorageProvider>
      </body>
    </html>
  );
}
