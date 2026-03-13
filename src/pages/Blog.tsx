import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewsletterSection from "@/components/NewsletterSection";
import { Helmet } from "react-helmet-async";
import { useAdminStatus } from "@/hooks/use-admin-status";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Blog = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStatus();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [postsRes, catsRes] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, published_at, created_at, categories(name, slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (postsRes.data) setPosts(postsRes.data as unknown as Post[]);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  const filtered = posts.filter((p) => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.categories?.slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog - Quinzinho Oliveira</title>
        <meta name="description" content="Artigos, reflexões e estratégias sobre negócios, finanças e vida por Quinzinho Oliveira." />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="pt-16">
        {/* Header */}
        <section className="py-16">
          <div className="section-container flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">
                Blog<span className="text-primary">.</span>
              </h1>
              <p className="text-muted-foreground">Artigos, reflexões e estratégias sobre negócios e vida.</p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin/post/new")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} /> Novo Post
                </button>
              )}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar artigos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category filter */}
        {categories.length > 0 && (
          <section className="pb-8">
            <div className="section-container">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.slug ? "" : cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Carregando artigos...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-heading text-lg font-bold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-sm text-muted-foreground">Tente outra busca ou categoria</p>
          </div>
        ) : (
          <>
            {featured && (
              <section className="pb-12">
                <div className="section-container">
                  <Link to={`/blog/${featured.slug}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden h-80 md:h-96">
                      {featured.cover_image_url ? (
                        <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-3">
                          {featured.categories?.name && <span className="category-badge">{featured.categories.name}</span>}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(featured.published_at || featured.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">{featured.title}</h2>
                        {featured.excerpt && <p className="text-sm text-muted-foreground max-w-lg">{featured.excerpt}</p>}
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="pb-16">
                <div className="section-container">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((a) => (
                      <Link to={`/blog/${a.slug}`} key={a.id}>
                        <article className="card-hover group">
                          <div className="rounded-xl overflow-hidden h-56 mb-4">
                            {a.cover_image_url ? (
                              <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            ) : (
                              <div className="w-full h-full bg-secondary" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            {a.categories?.name && <span className="category-badge">{a.categories.name}</span>}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(a.published_at || a.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <h3 className="font-heading text-lg font-bold mb-1">{a.title}</h3>
                          {a.excerpt && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{a.excerpt}</p>}
                          <span className="inline-flex items-center gap-1 text-sm text-foreground font-medium transition-colors hover:text-primary">
                            Ler artigo <ArrowRight size={14} />
                          </span>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <NewsletterSection />
      </div>
    </>
  );
};

export default Blog;
