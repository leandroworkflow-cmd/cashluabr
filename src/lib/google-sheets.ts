import { Deal } from "./types";

const SHEET_ID = "1x_45PJoQmKoFrCXeMAtvOXMlWrFYGB2tKcA6fFoS39s";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const MAX_IMPORTED_DEALS = 300;

export async function fetchDealsFromSheet(): Promise<Deal[]> {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Google Sheets returns JSONP-like response, strip wrapper
    const jsonString = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );
    const data = JSON.parse(jsonString);

    const rows = data.table.rows.slice(0, MAX_IMPORTED_DEALS);
    const deals: Deal[] = rows.map((row: any, index: number) => {
      const cells = row.c;
      return {
        id: cells[0]?.v?.toString() || `deal-${index}`,
        titulo: cells[1]?.v || "Sem título",
        preco: cells[2]?.v?.toString() || "0",
        link: cells[3]?.v || "#",
        imagem: cells[4]?.v || "",
        data: cells[5]?.v || new Date().toISOString(),
        loja: "Loja Online",
        categoria: "Eletrônicos",
        temperatura: Math.floor(Math.random() * 500) + 50,
        comentarios: Math.floor(Math.random() * 30),
      };
    });

    return deals;
  } catch (error) {
    console.error("Erro ao buscar dados do Google Sheets:", error);
    return [];
  }
}
