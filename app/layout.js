import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "@/components/Providers";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

// Fonts are bundled in app/fonts (Baloo 2 + Nunito, SIL Open Font License) so they work offline.
const display = localFont({
  src: [
    { path: "./fonts/baloo-2-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/baloo-2-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: [
    { path: "./fonts/nunito-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/nunito-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Martha's Learning Corner",
  description: "Tap-and-listen lessons for little learners: numbers, letters, words, colours, shapes and more.",
  applicationName: "Learning Corner",
  appleWebApp: { capable: true, title: "Learning Corner", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1f2e" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
