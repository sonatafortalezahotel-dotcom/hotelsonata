interface StructuredDataProps {
  data: object | object[];
}

/**
 * Componente para inserir Structured Data (JSON-LD) no head
 * Server Component - pode ser usado diretamente no layout
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

