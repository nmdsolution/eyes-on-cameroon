import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(de|fr|en)/);
  const path = localeMatch ? pathname.slice(localeMatch[0].length) || "/" : pathname;

  if (path.startsWith("/profil")) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const locale = localeMatch?.[1] ?? routing.defaultLocale;
        const url = new URL(`/${locale}/connexion`, request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    } catch {
      // Auth check failed — page server component will handle redirect
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!admin|api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
