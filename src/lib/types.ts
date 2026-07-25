export interface Deal {
  id: string;
  slug: string;
  titulo: string;
  preco: string;
  link: string;
  imagem: string;
  data: string;
  loja?: string;
  categoria?: string;
  temperatura?: number;
  comentarios?: number;
}

export type FilterType = "recentes" | "menor-preco" | "maior-preco";

export const CATEGORIES = [
  "Todos",
  "Eletrônicos",
  "Moda",
  "Games",
  "Casa",
  "Beleza",
  "Esportes",
  "Livros",
  "Alimentos",
] as const;

export type Category = (typeof CATEGORIES)[number];
