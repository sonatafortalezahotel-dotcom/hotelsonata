/**
 * Script para verificar landing pages no banco de dados
 * 
 * Uso: tsx scripts/check-landing-pages.ts
 */

import { db } from "../lib/db";
import { seoLandingPages } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function checkLandingPages() {
  console.log("🔍 Verificando landing pages no banco de dados...\n");

  const locales = ["pt", "en", "es"];

  for (const locale of locales) {
    console.log(`\n📋 Locale: ${locale.toUpperCase()}`);
    
    const pages = await db
      .select({
        slug: seoLandingPages.slug,
        title: seoLandingPages.title,
        active: seoLandingPages.active,
      })
      .from(seoLandingPages)
      .where(eq(seoLandingPages.locale, locale))
      .limit(20);

    console.log(`   Total de páginas: ${pages.length}`);
    console.log(`   Páginas ativas: ${pages.filter(p => p.active).length}`);
    console.log(`   Páginas inativas: ${pages.filter(p => !p.active).length}`);
    
    if (pages.length > 0) {
      console.log(`\n   Exemplos de slugs:`);
      pages.slice(0, 10).forEach((page) => {
        console.log(`   - ${page.slug} (${page.active ? "ativo" : "inativo"})`);
      });
    }

    // Verificar se existe a página "beachfront" em inglês
    if (locale === "en") {
      const beachfront = await db
        .select()
        .from(seoLandingPages)
        .where(
          eq(seoLandingPages.slug, "beachfront")
        )
        .limit(1);
      
      console.log(`\n   🔎 Busca por "beachfront":`);
      if (beachfront.length > 0) {
        beachfront.forEach((page) => {
          console.log(`   ✅ Encontrada: slug="${page.slug}", locale="${page.locale}", active=${page.active}`);
        });
      } else {
        console.log(`   ❌ Não encontrada`);
      }
    }
  }

  // Verificar todas as páginas com slug "beachfront" em qualquer locale
  console.log(`\n🔍 Buscando todas as páginas com slug "beachfront":`);
  const allBeachfront = await db
    .select()
    .from(seoLandingPages)
    .where(eq(seoLandingPages.slug, "beachfront"));

  if (allBeachfront.length > 0) {
    allBeachfront.forEach((page) => {
      console.log(`   - Locale: ${page.locale}, Active: ${page.active}, Title: ${page.title}`);
    });
  } else {
    console.log(`   ❌ Nenhuma página encontrada com slug "beachfront"`);
  }
}

checkLandingPages()
  .then(() => {
    console.log("\n✅ Verificação concluída");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });

