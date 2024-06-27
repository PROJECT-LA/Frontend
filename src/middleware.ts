import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { print } from "./utils";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token");
  print(`token middleware 🔐️: ${token?.value}`, req.nextUrl.pathname);

  try {
    if (req.nextUrl.pathname == "/") {
      if (token?.value) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/home";
        return NextResponse.redirect(url);
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    if (req.nextUrl.pathname == "/login") {
      if (token?.value) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/home";
        return NextResponse.redirect(url);
      } else {
        return NextResponse.next();
      }
    }

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.value && token?.value.length > 0) {
        return NextResponse.next();
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (e) {
    print(`Error verificando token en middleware`, e);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
