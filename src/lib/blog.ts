import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  slug: string;
  title: string;
  meta_description: string;
  excerpt: string;
  body: string;
  tags: string[];
  deal_refs: { slug: string; title: string; preco: string }[];
  published_on: string;
  published_at: string;
}

/** Artigos já publicados, do mais novo para o mais antigo. */
export async function fetchBlogPosts(limit = 20): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_on", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as BlogPost[];
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as BlogPost;
}

/**
 * Pede ao sistema do site o artigo do dia. Se ainda não existir, ele é
 * escrito na hora a partir das ofertas reais e guardado para as próximas visitas.
 */
export async function ensureTodayPost(): Promise<BlogPost | null> {
  const { data, error } = await supabase.functions.invoke("blog-post", {
    method: "POST",
  });

  if (error) {
    console.error("blog-post falhou:", error.message);
    return null;
  }
  return (data as BlogPost) ?? null;
}
