/**
 * Script para gerar landing pages de SEO automaticamente
 * 
 * Uso:
 * npm run generate-seo-pages
 * ou
 * tsx scripts/generate-seo-landing-pages.ts
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Palavras-chave principais para gerar landing pages
const KEYWORDS = {
  pt: [
    // Localização
    "hotel",
    "fortaleza",
    "praia de iracema",
    "beira mar",
    "frente mar",
    "ceará",
    "nordeste",
    // Características
    "vista mar",
    "vista para o mar",
    "piscina",
    "spa",
    "academia",
    "restaurante",
    "café da manhã",
    // Tipos de Serviço
    "quartos",
    "acomodações",
    "hospedagem",
    "pousada",
    "reservas",
    "reservar",
    // Ações
    "promoções",
    "ofertas",
    "pacotes",
    "descontos",
    "melhores preços",
    // Experiências
    "casamento",
    "eventos",
    "lazer",
    "gastronomia",
    "turismo",
  ],
  en: [
    "hotel",
    "fortaleza",
    "beachfront",
    "ocean view",
    "pool",
    "spa",
    "restaurant",
    "breakfast",
    "rooms",
    "accommodation",
    "booking",
    "reservations",
    "promotions",
    "packages",
    "wedding",
    "events",
    "leisure",
    "gastronomy",
    "tourism",
  ],
  es: [
    "hotel",
    "fortaleza",
    "frente al mar",
    "vista al mar",
    "piscina",
    "spa",
    "restaurante",
    "desayuno",
    "habitaciones",
    "alojamiento",
    "reservas",
    "promociones",
    "paquetes",
    "boda",
    "eventos",
    "ocio",
    "gastronomía",
    "turismo",
  ],
};

async function generateLandingPages() {
  console.log("🚀 Iniciando geração de landing pages de SEO...\n");

  // Verificar se o servidor está rodando
  try {
    const healthCheck = await fetch(`${SITE_URL}/api/seo-landing-pages`, {
      method: "GET",
    });
    if (!healthCheck.ok && healthCheck.status !== 404) {
      console.error(`⚠️  Aviso: Servidor pode não estar rodando (status: ${healthCheck.status})`);
      console.error(`   Certifique-se de que o servidor Next.js está rodando em ${SITE_URL}\n`);
    }
  } catch (error) {
    console.error(`❌ Erro ao conectar com o servidor: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`   Certifique-se de que o servidor Next.js está rodando em ${SITE_URL}\n`);
    return;
  }

  const locales = ["pt", "en", "es"] as const;
  const templates = ["rooms", "packages", "general"] as const;

  let totalGenerated = 0;

  for (const locale of locales) {
    console.log(`\n📝 Processando idioma: ${locale.toUpperCase()}`);
    const keywords = KEYWORDS[locale];

    for (const template of templates) {
      console.log(`  📄 Template: ${template}`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutos de timeout (300 segundos)

        const response = await fetch(`${SITE_URL}/api/seo-landing-pages/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keywords: keywords.slice(0, 15), // Limitar a 15 para não sobrecarregar
            locale,
            template,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } catch {
            // Se não conseguir fazer parse do JSON, usar a mensagem padrão
          }
          console.error(`    ❌ Erro: ${errorMessage}`);
          continue;
        }

        const result = await response.json();
        console.log(`    ✅ Geradas: ${result.generated} landing pages`);
        console.log(`    📊 Total de combinações: ${result.total}`);
        console.log(`    ⚠️  Já existentes: ${result.existing || 0}`);

        if (result.slugs && result.slugs.length > 0) {
          console.log(`    🔗 Exemplos: ${result.slugs.slice(0, 3).join(", ")}...`);
        }

        totalGenerated += result.generated || 0;
      } catch (error) {
        let errorMessage = "Erro desconhecido";
        
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = "Timeout: A requisição demorou mais de 5 minutos";
          } else if (error.message.includes("fetch")) {
            errorMessage = `Erro de conexão: ${error.message}. Verifique se o servidor está rodando em ${SITE_URL}`;
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = String(error);
        }
        
        console.error(`    ❌ Erro ao gerar landing pages: ${errorMessage}`);
        
        // Mostrar mais detalhes apenas em modo debug
        if (process.env.DEBUG && error instanceof Error && error.stack) {
          console.error(`    📋 Stack: ${error.stack}`);
        }
      }
    }
  }

  console.log(`\n✨ Total de landing pages geradas: ${totalGenerated}`);
  console.log(`\n📊 Próximos passos:`);
  console.log(`   1. Verificar sitemap: ${SITE_URL}/sitemap.xml`);
  console.log(`   2. Submeter no Google Search Console`);
  console.log(`   3. Monitorar visualizações e performance`);
}

// Executar se chamado diretamente
if (require.main === module) {
  generateLandingPages().catch(console.error);
}

export { generateLandingPages };

