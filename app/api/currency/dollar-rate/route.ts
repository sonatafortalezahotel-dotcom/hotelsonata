import { NextResponse } from "next/server";

/**
 * API Route para buscar a cotação oficial do dólar do Banco Central do Brasil
 * 
 * Esta rota faz proxy da requisição para evitar problemas de CORS
 * e permite cache no servidor
 */
export async function GET() {
  try {
    // API do Banco Central do Brasil - Cotação do dólar comercial (venda)
    // Série 1 = Taxa de câmbio - Livre - Dólar americano (venda) - diária
    const response = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json",
      {
        next: { revalidate: 3600 }, // Revalidar a cada hora
        headers: {
          "User-Agent": "Hotel Sonata de Iracema",
        },
      }
    );

    if (!response.ok) {
      console.error("Erro ao buscar cotação do dólar:", response.statusText);
      return NextResponse.json(
        { error: "Erro ao buscar cotação do dólar" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Resposta da API do BCB inválida:", data);
      return NextResponse.json(
        { error: "Dados inválidos da API do BCB" },
        { status: 500 }
      );
    }

    const rate = parseFloat(data[0].valor);

    if (isNaN(rate) || rate <= 0) {
      console.error("Taxa de câmbio inválida:", rate);
      return NextResponse.json(
        { error: "Taxa de câmbio inválida" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { rate, date: data[0].data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

