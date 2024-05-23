import { decodeToken } from "react-jwt";
import { print } from "./print";

export const checkToken = (token: string): boolean => {
  const myDecodedToken: any = decodeToken(token);
  const expiration = new Date(myDecodedToken.exp * 1000);

  print(`Token 🔐 : expira en ${expiration}`);

  return new Date().getTime() - expiration.getTime() < 0;
};
