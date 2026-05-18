// Encurta URLs usando is.gd (gratuito, sem chave, CORS habilitado).
// Fallback: retorna a URL original se a API falhar.
export async function shortenUrl(url: string): Promise<string> {
  try {
    const res = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return url;
    const short = (await res.text()).trim();
    return short.startsWith("http") ? short : url;
  } catch {
    return url;
  }
}
