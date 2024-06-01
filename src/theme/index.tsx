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
import { lightTheme } from "./light-theme";
import { darkTheme } from "./dark-theme";
import { useMediaQuery } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { saveCookie, readCookie, print } from "@/utils";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);
export const useThemeContext = () => useContext(ThemeContext);
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY);

  const isMountRef = useRef(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isDarkOS ? "dark" : "light"
  );

  const debounced = useDebouncedCallback(() => {
    isMountRef.current = true;
  }, 500);

  const saveDarkMode = () => {
    setThemeMode("dark");
    saveCookie("theme", "dark");
    print("🌙");
  };

  const saveLightMode = () => {
    setThemeMode("light");
    saveCookie("theme", "light");
    print("☀️");
  };

  const saveAutomaticMode = () => {
    setThemeMode(isDarkOS ? "dark" : "light");
    saveCookie("theme", isDarkOS ? "dark" : "light");
    print("isDarkOS: ", isDarkOS ? "🌙" : "☀️");
  };

  const toggleTheme = () => {
    switch (themeMode) {
      case "light":
        saveDarkMode();
        break;
      case "dark":
        saveLightMode();
        break;
      default:
    }
  };

  useEffect(() => {
    const themeModeSaved = readCookie("theme");
    print("theme", themeModeSaved);

    if (!themeModeSaved) {
      saveAutomaticMode();
      isMountRef.current = false;
      return;
    }

    switch (themeModeSaved) {
      case "dark":
        saveDarkMode();
        break;
      case "light":
        saveLightMode();
        break;
      default:
        saveLightMode();
        break;
    }
    isMountRef.current = false;
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMountRef.current) {
      saveAutomaticMode();
    }
    debounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ThemeContext.Provider>
  );
}
