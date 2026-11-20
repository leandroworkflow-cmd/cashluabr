// Converte textos de preço ("95.99", "95,99", "1.299,90", "R$ 65,99") em número.
export function toNumber(preco: string | number | undefined): number {
  if (preco === undefined || preco === null || preco === "") return 0;
  if (typeof preco === "number") return preco;
  let s = String(preco).replace(/[^\d.,-]/g, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatBRL(preco: string | number | undefined): string {
  return BRL.format(toNumber(preco));
}
