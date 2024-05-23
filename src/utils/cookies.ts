import Cookies from "js-cookie";

export const saveCookie = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes | undefined
) => {
  Cookies.set(key, value, options);
};

export const readCookie = (key: string): string | undefined => Cookies.get(key);

export const deleteCookie = (key: string) => {
  return Cookies.remove(key);
};
