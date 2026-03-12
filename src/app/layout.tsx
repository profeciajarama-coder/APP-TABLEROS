import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Control de Tableros Eléctricos",
  description: "Sistema de gestión de tableros eléctricos de planta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
