"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { saveCookie, readCookie, print } from "@/utils";
import { darkTheme, lightTheme } from "./colors";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextType {
  themeMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);
export const useThemeContext = () => useContext(ThemeContext);
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY);

  const isMountRef = useRef(false);

  const [themeMode, setThemeMode] = useState(isDarkOS);

  const debounced = useDebouncedCallback(() => {
    isMountRef.current = true;
  }, 800);

  const saveDarkMode = () => {
    setThemeMode(true);
    saveCookie("theme", "dark");
    print("🌙");
  };

  const saveLightMode = () => {
    setThemeMode(false);
    saveCookie("theme", "light");
    print("☀️");
  };

  const guardarModoAutomatico = () => {
    setThemeMode(isDarkOS);
    saveCookie("theme", isDarkOS ? "dark" : "light");
    print("isDarkOS: ", isDarkOS ? "🌙" : "☀️");
  };

  const toggleTheme = () => {
    if (themeMode) saveLightMode();
    else saveDarkMode();
  };

  useEffect(() => {
    const themeModeSaved = readCookie("theme");
    print("theme", themeModeSaved);
    if (!themeModeSaved) {
      guardarModoAutomatico();
      isMountRef.current = false;
      return;
    }
    themeModeSaved ? saveDarkMode() : saveLightMode();
    isMountRef.current = false;
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMountRef.current) {
      guardarModoAutomatico();
    }
    debounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={themeMode ? darkTheme : lightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ThemeContext.Provider>
  );
}
