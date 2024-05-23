import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { StyledEngineProvider } from "@mui/material";
import ThemeRegistry from "@/theme";
import { FullScreenLoadingProvider } from "@/context/FullScreenLoadingProvider";
import Responsive from "@/components/Responsive";

export const metadata: Metadata = {
  title: "Sistema auditorías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ position: "relative" }}>
        <StyledEngineProvider injectFirst>
          <ThemeRegistry>
            <FullScreenLoadingProvider>{children}</FullScreenLoadingProvider>
          </ThemeRegistry>
        </StyledEngineProvider>
        <Toaster richColors closeButton expand />
        <Responsive />
      </body>
    </html>
  );
}
