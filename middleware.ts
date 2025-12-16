import { NextRequest, NextResponse } from "next/server";

const locales = ["pt", "en", "es"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verifica se o pathname começa com algum locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Se tem locale na URL (ex: /en/esg), precisamos remover para acessar o arquivo correto (app/esg/page.tsx)
    // Mas mantemos a URL no navegador igual.
    const locale = locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    
    // Remove o locale do path. Ex: /en/esg -> /esg
    const newPathname = pathname.replace(`/${locale}`, "") || "/";
    
    // Cria a nova URL para o rewrite
    const newUrl = new URL(newPathname, request.url);
    
    // Faz o rewrite. O usuário vê /en/esg, mas o Next carrega /esg
    return NextResponse.rewrite(newUrl);
  }

  // Se não tem locale, deixa passar normal (assume pt ou o que o contexto decidir, ou a rota raiz)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
