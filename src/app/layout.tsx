import type { Metadata } from "next";
import "./globals.css";
import { StorageProvider } from "@/context/StorageContext";
import { UiProvider } from "@/context/UiContext";

export const metadata: Metadata = {
  title: "Presupuesto Personal",
  description: "Gestión inteligente de finanzas personales",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        <StorageProvider>
          <UiProvider>
            {children}
          </UiProvider>
        </StorageProvider>
      </body>
    </html>
  );
}
