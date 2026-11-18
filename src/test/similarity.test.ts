import { describe, it, expect } from "vitest";
import { findSimilarDeals, similarityScore, titleTokens } from "@/lib/similarity";
import { Deal } from "@/lib/types";

const deal = (over: Partial<Deal> & Pick<Deal, "id" | "titulo">): Deal => ({
  slug: over.id,
  preco: "100",
  link: "https://example.com",
  imagem: "",
  data: "2026-11-17",
  ...over,
});

const target = deal({
  id: "1",
  titulo: "Tênis Nike Air Max 90 Masculino",
  preco: "399,90",
  categoria: "Moda",
});

const sameBrandSameKind = deal({
  id: "2",
  titulo: "Tênis Nike Revolution 7 Masculino",
  preco: "289,00",
  categoria: "Moda",
});

const sameKindOtherBrand = deal({
  id: "3",
  titulo: "Tênis Adidas Runfalcon 3 Masculino",
  preco: "279,00",
  categoria: "Moda",
});

const unrelated = deal({
  id: "4",
  titulo: "Air Fryer Mondial 4 Litros",
  preco: "329,00",
  categoria: "Casa",
});

const totallyUnrelated = deal({
  id: "5",
  titulo: "Livro Dom Casmurro",
  preco: "25,00",
  categoria: "Livros",
});

describe("similarityScore", () => {
  it("não compara a oferta com ela mesma", () => {
    expect(similarityScore(target, target)).toBe(0);
  });

  it("põe a mesma marca e o mesmo tipo de produto à frente de outra marca", () => {
    const sameBrand = similarityScore(target, sameBrandSameKind);
    const otherBrand = similarityScore(target, sameKindOtherBrand);
    expect(sameBrand).toBeGreaterThan(otherBrand);
    expect(sameBrand).toBeGreaterThan(0);
  });

  it("não considera parecido um produto de outra categoria", () => {
    expect(similarityScore(target, unrelated)).toBeLessThan(
      similarityScore(target, sameKindOtherBrand),
    );
    expect(similarityScore(target, totallyUnrelated)).toBe(0);
  });

  it("dá nota maior quando os preços estão próximos", () => {
    const near = deal({ id: "6", titulo: "Tênis Nike Revolution 7 Masculino", preco: "410,00", categoria: "Moda" });
    const far = deal({ id: "7", titulo: "Tênis Nike Revolution 7 Masculino", preco: "40,00", categoria: "Moda" });
    expect(similarityScore(target, near)).toBeGreaterThan(
      similarityScore(target, far),
    );
  });
});

describe("titleTokens", () => {
  it("remove acentos e palavras genéricas de oferta", () => {
    const tokens = titleTokens("Promoção de Tênis Nike Grátis");
    expect(tokens).toEqual(["tenis", "nike"]);
  });
});

describe("findSimilarDeals", () => {
  it("retorna as mais parecidas primeiro e exclui a própria oferta", () => {
    const result = findSimilarDeals(target, [unrelated, sameKindOtherBrand, sameBrandSameKind, target], 3);
    expect(result[0].id).toBe("2");
    expect(result.map((d) => d.id)).not.toContain("1");
    expect(result.map((d) => d.id)).toEqual(["2", "3", "4"]);
  });

  it("devolve lista vazia quando nada é parecido", () => {
    expect(findSimilarDeals(target, [totallyUnrelated], 6)).toEqual([]);
  });

  it("respeita o limite pedido", () => {
    const result = findSimilarDeals(target, [unrelated, sameKindOtherBrand, sameBrandSameKind], 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
});
