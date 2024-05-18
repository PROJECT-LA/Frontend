import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CONSTANTS } from "../../config";
import { StyledEngineProvider } from "@mui/material";
import ThemeRegistry from "@/theme";
import { FullScreenLoadingProvider } from "@/context/FullScreenLoading";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: CONSTANTS.title,
  description: CONSTANTS.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        <StyledEngineProvider injectFirst>
          <ThemeRegistry>
            <FullScreenLoadingProvider>{children}</FullScreenLoadingProvider>
          </ThemeRegistry>
        </StyledEngineProvider>
        <Toaster richColors closeButton expand />
      </body>
    </html>
  );
}
