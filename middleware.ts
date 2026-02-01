import { NextRequest, NextResponse } from "next/server";

const locales = ["pt", "en", "es"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Se a rota é apenas um locale (ex: /en, /es, /pt), redireciona para a home
  if (locales.some((locale) => pathname === `/${locale}`)) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Verifica se o pathname começa com algum locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`)
  );

  let response: NextResponse;

  if (pathnameHasLocale) {
    const locale = locales.find(
      (locale) => pathname.startsWith(`/${locale}/`)
    );
    
    // Verificar se é uma rota conhecida (não catch-all)
    // Rotas conhecidas: mesma página com outro idioma → rewrite para path sem locale
    const knownRoutes = ["esg", "quartos", "gastronomia", "lazer", "eventos", "contato", "pacotes", "reservas", "hotel", "checkout", "trabalhe-conosco", "blog", "admin"];
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const firstSegment = pathWithoutLocale.split("/").filter(Boolean)[0];
    const isKnownRoute = knownRoutes.includes(firstSegment || "");
    
    // Se for uma rota conhecida, faz rewrite removendo o locale
    // Se não for (é uma landing page catch-all), não faz rewrite
    if (isKnownRoute) {
      // Remove o locale do path. Ex: /en/esg -> /esg
      const newPathname = pathWithoutLocale;
      
      // Cria a nova URL para o rewrite
      const newUrl = new URL(newPathname, request.url);
      
      // Cria a resposta com rewrite e adiciona o locale como header customizado
      response = NextResponse.rewrite(newUrl);
      // Adiciona o locale como header para ser acessado no server component
      response.headers.set("x-locale", locale || "pt");
    } else {
      // É uma rota catch-all (landing page), não faz rewrite
      // Deixa o locale no pathname para que o componente possa detectá-lo diretamente
      response = NextResponse.next();
      response.headers.set("x-locale", locale || "pt");
    }
  } else {
    // Sem locale na URL: assume português (pt) e envia no header para as páginas
    response = NextResponse.next();
    response.headers.set("x-locale", "pt");
  }

  // Adicionar headers de segurança e compatibilidade
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Cache headers baseado no tipo de recurso
  if (pathname.startsWith("/_next/static/")) {
    // Recursos estáticos do Next.js - cache longo
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/api/")) {
    // APIs - sem cache para garantir dados atualizados
    response.headers.set("Cache-Control", "no-cache");
  } else if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
    // Arquivos estáticos - cache longo
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    // Páginas HTML - cache curto com revalidação
    response.headers.set("Cache-Control", "public, max-age=3600");
    response.headers.set("Content-Type", "text/html; charset=utf-8");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
