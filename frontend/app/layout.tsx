import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Humano Saúde - Broker OS",
  description: "Sistema completo de gestão e cotações para corretores de saúde com IA",
  keywords: ["saúde", "corretora", "cotações", "IA", "broker"],
  authors: [{ name: "Humano Saúde" }],
  creator: "Humano Saúde",
  publisher: "Humano Saúde",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://humanosaude.com.br",
    title: "Humano Saúde - Broker OS",
    description: "Sistema completo de gestão e cotações para corretores de saúde com IA",
    siteName: "Humano Saúde",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
