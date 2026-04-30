import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Plus, BookOpen, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import { useAdminStatus } from "@/hooks/use-admin-status";

// Visual treatment per content type. Slugs match the seeded categories.
const CATEGORY_STYLES: Record<string, { badge: string; ring: string; icon: typeof BookOpen; label: string }> = {
  reflexoes: {
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    ring: "hover:ring-purple-500/40",
    icon: Sparkles,
    label: "Reflexão",
  },
  aprenda: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    ring: "hover:ring-emerald-500/40",
    icon: BookOpen,
    label: "Aprenda",
  },
};

function categoryStyle(slug?: string | null) {
  return (slug && CATEGORY_STYLES[slug]) || null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  category: { name: string; slug: string } | null;
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
    Promise.all([api.get<Post[]>("/posts"), api.get<Category[]>("/categories")])
      .then(([p, c]) => {
        setPosts(p || []);
        setCategories(c || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.category?.slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <SEO
        title="Blog"
        description="Artigos, reflexões e estratégias sobre negócios, finanças, empreendedorismo e vida por Quinzinho Oliveira."
      />

      <div className="pt-14 sm:pt-16">
        <section className="py-10 sm:py-16">
          <div className="section-container flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Blog<span className="text-primary">.</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Artigos, reflexões e estratégias sobre negócios e vida.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

        {categories.length > 0 && (
          <section className="pb-8">
            <div className="section-container">
              {/* Two main content modes — featured prominently */}
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {(["reflexoes", "aprenda"] as const).map((slug) => {
                  const cat = categories.find((c) => c.slug === slug);
                  if (!cat) return null;
                  const style = CATEGORY_STYLES[slug];
                  const Icon = style.icon;
                  const active = activeCategory === slug;
                  const count = posts.filter((p) => p.category?.slug === slug).length;
                  return (
                    <button
                      key={slug}
                      onClick={() => setActiveCategory(active ? "" : slug)}
                      className={`group flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        active
                          ? `${style.badge} border-current`
                          : "bg-card border-border hover:border-foreground/20"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${style.badge} border ${active ? "" : ""}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-heading font-bold text-sm">{cat.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {slug === "reflexoes" ? "Pensamentos sobre vida e jornada" : "Tutoriais e ensinamentos práticos"}
                          {count > 0 && ` • ${count} ${count === 1 ? "post" : "posts"}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* All other categories as compact pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !activeCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos
                </button>
                {categories
                  .filter((c) => c.slug !== "reflexoes" && c.slug !== "aprenda")
                  .map((cat) => (
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
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-64 sm:h-80 md:h-96">
                      {featured.coverImageUrl ? (
                        <img src={featured.coverImageUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                          {featured.category?.name && <span className="category-badge">{featured.category.name}</span>}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(featured.publishedAt || featured.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight">{featured.title}</h2>
                        {featured.excerpt && <p className="text-xs sm:text-sm text-muted-foreground max-w-lg line-clamp-2">{featured.excerpt}</p>}
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
                    {rest.map((a) => {
                      const style = categoryStyle(a.category?.slug);
                      const Icon = style?.icon;
                      return (
                        <Link to={`/blog/${a.slug}`} key={a.id}>
                          <article className="card-hover group">
                            <div className="rounded-xl overflow-hidden h-56 mb-4 relative">
                              {a.coverImageUrl ? (
                                <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                              ) : (
                                <div className="w-full h-full bg-secondary" />
                              )}
                              {style && Icon && (
                                <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider backdrop-blur ${style.badge}`}>
                                  <Icon size={11} /> {style.label}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              {a.category?.name && !style && <span className="category-badge">{a.category.name}</span>}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(a.publishedAt || a.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                              </span>
                            </div>
                            <h3 className="font-heading text-lg font-bold mb-1">{a.title}</h3>
                            {a.excerpt && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{a.excerpt}</p>}
                            <span className="inline-flex items-center gap-1 text-sm text-foreground font-medium transition-colors hover:text-primary">
                              Ler artigo <ArrowRight size={14} />
                            </span>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <NewsletterSection />
      </div>

      {isAdmin && (
        <button
          onClick={() => navigate("/admin/post/new")}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Novo Post
        </button>
      )}
    </>
  );
};

export default Blog;
