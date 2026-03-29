import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio AI | Workspace",
  description: "Google AI Studio model management and analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-forge-surface text-white antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
