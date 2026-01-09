import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";

async function createPackages() {
  console.log("📦 Criando pacotes...");

  try {
    // Data atual e final do ano
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31); // 31 de dezembro
    
    const startDate = today.toISOString().split("T")[0];
    const endDate = endOfYear.toISOString().split("T")[0];

    const packagesData = [
      {
        name: "Day Use",
        description: "Aproveite um dia completo no hotel com acesso à piscina, área de lazer e muito mais",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
        price: 15000, // R$ 150,00 em centavos
        startDate,
        endDate,
        active: true,
        order: 1,
        category: "day-use",
      },
      {
        name: "Pacote Familiar",
        description: "Experiência completa para toda a família com atividades para crianças e adultos",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop",
        price: 120000, // R$ 1.200,00 em centavos
        startDate,
        endDate,
        active: true,
        order: 2,
        category: "cabana-kids",
      },
      {
        name: "Pacote Romântico",
        description: "Uma experiência inesquecível para casais com jantar romântico e decoração especial",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop",
        price: 80000, // R$ 800,00 em centavos
        startDate,
        endDate,
        active: true,
        order: 3,
        category: "nupcias",
      },
    ];

    // Verificar se já existem pacotes com esses nomes
    const existingPackages = await db.select().from(packages);
    const existingNames = existingPackages.map(p => p.name.toLowerCase());

    for (const pkg of packagesData) {
      if (existingNames.includes(pkg.name.toLowerCase())) {
        console.log(`⚠️  Pacote "${pkg.name}" já existe. Pulando...`);
        continue;
      }

      const [newPackage] = await db
        .insert(packages)
        .values(pkg)
        .returning();

      console.log(`✅ Pacote "${pkg.name}" criado com sucesso! ID: ${newPackage.id}`);
    }

    console.log("✨ Processo concluído!");
  } catch (error) {
    console.error("❌ Erro ao criar pacotes:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createPackages()
    .then(() => {
      console.log("✅ Script executado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro ao executar script:", error);
      process.exit(1);
    });
}

export { createPackages };
