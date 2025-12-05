import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { StorageProvider } from "@/context/StorageContext";

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
      <body>
        <StorageProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Desktop Sidebar */}
            <div className="desktop-only">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="main-content" style={{
              flex: 1,
              marginLeft: '250px', // Default for desktop, overridden by CSS media query
              minHeight: '100vh',
              padding: '2rem',
              transition: 'margin-left 0.3s ease'
            }}>
              {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-only">
              <BottomNav />
            </div>
          </div>
        </StorageProvider>
      </body>
    </html>
  );
}
