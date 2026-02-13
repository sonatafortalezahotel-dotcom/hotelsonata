import { pgTable, serial, text, timestamp, boolean, varchar, integer, date, jsonb, decimal, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";

// Tabela de usuários (para admin)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hash da senha
  role: varchar("role", { length: 20 }).default("admin").notNull(), // "admin", "editor"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de destaques (carrossel principal)
export const highlights = pgTable("highlights", {
  id: serial("id").primaryKey(),
  title: text("title"), // Opcional
  description: text("description"),
  imageUrl: text("image_url"), // Opcional: pode ser null se houver videoUrl
  videoUrl: text("video_url"),
  link: text("link"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para destaques
export const highlightTranslations = pgTable("highlight_translations", {
  id: serial("id").primaryKey(),
  highlightId: integer("highlight_id").notNull().references(() => highlights.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(), // "pt", "es", "en"
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de pacotes
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  price: integer("price"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  category: varchar("category", { length: 50 }), // "cabana-kids", "pet-friendly", "day-use", "casamento", "eventos", "nupcias"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para pacotes
export const packageTranslations = pgTable("package_translations", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de quartos/acomodações
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // "standard", "luxo", "suite-luxo"
  size: integer("size"), // metros quadrados
  maxGuests: integer("max_guests").notNull().default(2),
  hasSeaView: boolean("has_sea_view").default(true).notNull(),
  hasBalcony: boolean("has_balcony").default(false).notNull(),
  amenities: jsonb("amenities"), // Array de amenidades
  basePrice: integer("base_price"),
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery"), // Array de URLs de imagens
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para quartos
export const roomTranslations = pgTable("room_translations", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  amenities: jsonb("amenities"), // Array de amenidades traduzidas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de gastronomia
export const gastronomy = pgTable("gastronomy", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "cafe-manha", "restaurante", "bar", "room-service"
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery"), // Array de URLs de imagens
  schedule: jsonb("schedule"), // Horários de funcionamento
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para gastronomia
export const gastronomyTranslations = pgTable("gastronomy_translations", {
  id: serial("id").primaryKey(),
  gastronomyId: integer("gastronomy_id").notNull().references(() => gastronomy.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  menu: jsonb("menu"), // Estrutura de menu traduzido
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de lazer/atividades
export const leisure = pgTable("leisure", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "piscina", "academia", "beach-tennis", "bike", "spa"
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery"),
  icon: varchar("icon", { length: 50 }), // Nome do ícone
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para lazer
export const leisureTranslations = pgTable("leisure_translations", {
  id: serial("id").primaryKey(),
  leisureId: integer("leisure_id").notNull().references(() => leisure.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  schedule: text("schedule"), // Horários traduzidos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de eventos
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "corporativo", "casamento", "nupcias", "social"
  capacity: integer("capacity"),
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery"),
  facilities: jsonb("facilities"), // Array de facilidades
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para eventos
export const eventTranslations = pgTable("event_translations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  facilities: jsonb("facilities"), // Array de facilidades traduzidas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de informações de contato
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "telefone", "email", "endereco", "whatsapp", "instagram", "facebook"
  value: text("value").notNull(),
  label: text("label"),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para contato
export const contactInfoTranslations = pgTable("contact_info_translations", {
  id: serial("id").primaryKey(),
  contactInfoId: integer("contact_info_id").notNull().references(() => contactInfo.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  label: text("label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de SEO (metadados por página e idioma)
export const seoMetadata = pgTable("seo_metadata", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 100 }).notNull(), // "home", "quartos", "gastronomia", etc
  locale: varchar("locale", { length: 5 }).notNull(), // "pt", "es", "en"
  title: text("title").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords"), // Separados por vírgula
  ogImage: text("og_image"), // Open Graph image
  canonicalUrl: text("canonical_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de configurações do site
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }), // "text", "json", "url", "image"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de galeria de fotos
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title"),
  imageUrl: text("image_url").notNull(),
  // Sistema antigo (mantido para compatibilidade)
  category: varchar("category", { length: 50 }), // "piscina", "recepcao", "restaurante", "quarto", "geral"
  // Sistema novo - Organização por página
  page: varchar("page", { length: 50 }), // "home", "lazer", "gastronomia", "esg", "contato"
  section: varchar("section", { length: 100 }), // "hero", "galeria-piscina", "cards-gastronomia", "photo-story", etc.
  description: text("description"), // Descrição do que a imagem mostra
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de ações de sustentabilidade e inclusão
export const sustainability = pgTable("sustainability", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: varchar("category", { length: 50 }), // "sustentabilidade", "inclusao", "acoes-sociais", "obras-locais"
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para sustentabilidade
export const sustainabilityTranslations = pgTable("sustainability_translations", {
  id: serial("id").primaryKey(),
  sustainabilityId: integer("sustainability_id").notNull().references(() => sustainability.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de selos e certificações
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para certificações
export const certificationTranslations = pgTable("certification_translations", {
  id: serial("id").primaryKey(),
  certificationId: integer("certification_id").notNull().references(() => certifications.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de posts das redes sociais
export const socialMediaPosts = pgTable("social_media_posts", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 20 }).notNull(), // "instagram", "facebook", etc
  imageUrl: text("image_url").notNull(),
  link: text("link"),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de leads de eventos (B2B)
export const eventLeads = pgTable("event_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  eventType: varchar("event_type", { length: 50 }),
  eventDate: date("event_date"),
  guests: integer("guests"),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("new").notNull(), // "new", "contacted", "quoted", "closed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de mensagens do formulário de contato
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("new").notNull(), // "new", "read", "replied", "closed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de pontos turísticos próximos
export const nearbyAttractions = pgTable("nearby_attractions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(), // "iracema", "ponte-ingleses", "dragao-mar", "orla-fortaleza"
  imageUrl: text("image_url").notNull(),
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para pontos turísticos próximos
export const nearbyAttractionTranslations = pgTable("nearby_attraction_translations", {
  id: serial("id").primaryKey(),
  nearbyAttractionId: integer("nearby_attraction_id").notNull().references(() => nearbyAttractions.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(), // "pt", "es", "en"
  name: text("name").notNull(),
  distance: text("distance").notNull(), // "Em frente ao hotel", "5 minutos a pé", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de reservas
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  confirmationNumber: varchar("confirmation_number", { length: 20 }).notNull().unique(), // Número único de confirmação
  roomId: integer("room_id").notNull().references(() => rooms.id, { onDelete: "restrict" }),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  adults: integer("adults").notNull().default(2),
  children: integer("children").default(0).notNull(),
  // Dados do hóspede
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestDocument: text("guest_document"), // CPF/Passaporte
  // Preços e promoções
  basePrice: integer("base_price").notNull(), // Preço por noite em centavos
  totalNights: integer("total_nights").notNull(),
  totalPrice: integer("total_price").notNull(), // Preço total em centavos
  promoCode: varchar("promo_code", { length: 50 }), // Código promocional aplicado
  discount: integer("discount").default(0).notNull(), // Desconto em centavos
  // Informações adicionais
  specialRequests: text("special_requests"), // Solicitações especiais do hóspede
  status: varchar("status", { length: 20 }).default("pending").notNull(), // "pending", "confirmed", "cancelled", "completed"
  // Pagamento
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(), // "pending", "paid", "failed", "refunded"
  paymentMethod: varchar("payment_method", { length: 50 }), // "credit_card", "pix", "bank_transfer"
  paymentIntentId: varchar("payment_intent_id", { length: 200 }), // ID do pagamento no gateway (Stripe, etc.)
  paymentDate: timestamp("payment_date"), // Data do pagamento
  // Metadados
  notes: text("notes"), // Notas internas do hotel
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de landing pages dinâmicas para SEO
export const seoLandingPages = pgTable("seo_landing_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(), // "hotel-em-fortaleza", "quartos-com-vista-mar"
  locale: varchar("locale", { length: 5 }).notNull().default("pt"), // "pt", "es", "en"
  title: text("title").notNull(), // Título SEO otimizado
  description: text("description").notNull(), // Meta description
  keywords: text("keywords").notNull(), // Palavras-chave principais separadas por vírgula
  h1: text("h1"), // Título H1 da página (pode ser diferente do title)
  content: text("content"), // Conteúdo HTML da landing page
  ogImage: text("og_image"), // Imagem Open Graph
  canonicalUrl: text("canonical_url"), // URL canônica
  // Configurações de conteúdo dinâmico
  contentType: varchar("content_type", { length: 50 }), // "rooms", "packages", "general", "location"
  relatedRoomIds: jsonb("related_room_ids"), // IDs de quartos relacionados
  relatedPackageIds: jsonb("related_package_ids"), // IDs de pacotes relacionados
  // SEO técnico
  priority: decimal("priority", { precision: 2, scale: 1 }).default("0.8"), // Prioridade no sitemap (0.0 a 1.0)
  changeFrequency: varchar("change_frequency", { length: 20 }).default("weekly"), // "always", "hourly", "daily", "weekly", "monthly", "yearly", "never"
  // Status
  active: boolean("active").default(true).notNull(),
  // Analytics
  viewCount: integer("view_count").default(0).notNull(),
  lastViewedAt: timestamp("last_viewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabela de traduções para landing pages
export const seoLandingPageTranslations = pgTable("seo_landing_page_translations", {
  id: serial("id").primaryKey(),
  landingPageId: integer("landing_page_id").notNull().references(() => seoLandingPages.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(), // "pt", "es", "en"
  title: text("title").notNull(),
  description: text("description").notNull(),
  h1: text("h1"),
  content: text("content"),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Conteúdo editável por página (overrides de traduções no editor visual)
export const pageContent = pgTable("page_content", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 50 }).notNull(), // hotel | lazer | quartos | gastronomia | eventos | esg | contato
  section: varchar("section", { length: 100 }).notNull(), // hero, gallery, etc.
  fieldKey: varchar("field_key", { length: 100 }).notNull(), // title, subtitle, description
  locale: varchar("locale", { length: 5 }).notNull(), // pt, es, en
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Blog ---

// Categorias do blog
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Traduções para categorias do blog
export const blogCategoryTranslations = pgTable("blog_category_translations", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(), // "pt", "es", "en"
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tags do blog
export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Traduções para tags do blog
export const blogTagTranslations = pgTable("blog_tag_translations", {
  id: serial("id").primaryKey(),
  tagId: integer("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 5 }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts do blog (slug+locale único por idioma)
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull(),
  locale: varchar("locale", { length: 5 }).notNull().default("pt"), // "pt", "es", "en"
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"), // HTML
  featuredImageUrl: text("featured_image_url"),
  authorName: text("author_name"),
  authorUrl: text("author_url"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // "draft" | "published"
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogImage: text("og_image"),
  canonicalUrl: text("canonical_url"),
  order: integer("order").default(0).notNull(),
}, (table) => ({
  slugLocaleUnique: uniqueIndex("blog_posts_slug_locale_idx").on(table.slug, table.locale),
}));

// Relação N:N posts <-> categorias
export const blogPostCategories = pgTable("blog_post_categories", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => blogCategories.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
}));

// Relação N:N posts <-> tags
export const blogPostTags = pgTable("blog_post_tags", {
  postId: integer("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

