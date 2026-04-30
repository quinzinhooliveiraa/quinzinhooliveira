import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Calendar, Tag, Eye, Heart, Clock, BookOpen, Sparkles, List } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import { getSessionId } from "@/hooks/use-session-id";

// Slugify heading text into stable ids for TOC anchoring
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// Strip HTML to plain text for word count
function htmlToText(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, " ");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Parse H2/H3 headings from HTML to build a table of contents
function extractToc(html: string): { id: string; text: string; level: 2 | 3 }[] {
  if (typeof window === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const headings = Array.from(div.querySelectorAll("h2, h3"));
  const used = new Set<string>();
  return headings.map((h) => {
    const text = (h.textContent || "").trim();
    let id = slugifyHeading(text) || `s-${Math.random().toString(36).slice(2, 8)}`;
    let i = 1;
    while (used.has(id)) id = `${slugifyHeading(text)}-${++i}`;
    used.add(id);
    return { id, text, level: h.tagName === "H2" ? 2 : 3 };
  });
}

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const load = async () => {
    try {
      const data = await api.get<PostData>(`/posts/${slug}`);
      setPost(data);
      const sessionId = getSessionId();
      const [v, l, hasLiked] = await Promise.all([
        api.get<{ count: number }>(`/post-views/${data.id}/count`),
        api.get<{ count: number }>(`/post-likes/${data.id}/count`),
        api.get<{ liked: boolean }>(`/post-likes/${data.id}/has?sessionId=${encodeURIComponent(sessionId)}`),
      ]);
      setViewCount(v.count || 0);
      setLikeCount(l.count || 0);
      setLiked(!!hasLiked.liked);
      api.post("/post-views", { postId: data.id, sessionId }).then(() => setViewCount((c) => c + 1)).catch(() => {});
    } catch {
      setPost(null);
    }
    setLoading(false);
  };

  const toggleLike = async () => {
    if (!post) return;
    const sessionId = getSessionId();
    if (liked) {
      await api.del("/post-likes", { postId: post.id, sessionId });
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await api.post("/post-likes", { postId: post.id, sessionId });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Post não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">Voltar ao blog</Link>
        </div>
      </div>
    );
  }

  const pageTitle = post.metaTitle || post.title;
  const pageDescription = post.metaDescription || post.excerpt || "";
  const canonicalPath = `/blog/${post.slug}`;
  const canonicalUrl = `https://quinzinhooliveira.com.br${canonicalPath}`;
  const categorySlug = post.category?.slug || "";
  const isReflection = categorySlug === "reflexoes";
  const isLearn = categorySlug === "aprenda";

  // Reading time: ~220 words per minute (PT-BR average)
  const readingMinutes = useMemo(() => {
    const text = htmlToText(post.content);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }, [post.content]);

  // Build TOC from H2/H3 (only used for "Aprenda" tutorials)
  const toc = useMemo(() => (isLearn ? extractToc(post.content) : []), [post.content, isLearn]);

  // After render, inject IDs into the actual headings so TOC anchors work
  const articleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isLearn || !articleRef.current || toc.length === 0) return;
    const headings = articleRef.current.querySelectorAll("h2, h3");
    headings.forEach((h, i) => {
      const item = toc[i];
      if (item && !h.id) h.id = item.id;
    });
  }, [post.content, isLearn, toc]);

  // After render, inject visible captions for images that have data-caption
  useEffect(() => {
    if (!articleRef.current) return;
    const imgs = articleRef.current.querySelectorAll<HTMLImageElement>("img[data-caption]");
    imgs.forEach((img) => {
      const caption = img.getAttribute("data-caption");
      if (!caption) return;
      const next = img.nextElementSibling as HTMLElement | null;
      if (next && next.classList.contains("image-caption")) {
        next.textContent = caption;
        return;
      }
      const span = document.createElement("span");
      span.className = "image-caption";
      span.setAttribute("data-align", img.getAttribute("data-align") || "center");
      span.setAttribute("data-size", img.getAttribute("data-size") || "large");
      span.textContent = caption;
      img.insertAdjacentElement("afterend", span);
    });
  }, [post.content]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: pageDescription,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.createdAt,
    author: { "@type": "Person", name: "Quinzinho Oliveira" },
    publisher: { "@type": "Organization", name: "Quinzinho Oliveira" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        image={post.coverImageUrl || undefined}
        type="article"
        canonicalPath={canonicalPath}
        publishedTime={post.publishedAt || post.createdAt}
        author="Quinzinho Oliveira"
        jsonLd={jsonLd}
      />

      <div className="pt-14 sm:pt-16">
        {post.coverImageUrl && (
          <div className="w-full h-48 sm:h-64 md:h-96 overflow-hidden">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <article className={isReflection ? "py-8 sm:py-14 md:py-24" : "py-6 sm:py-10 md:py-16"}>
          <div className={`section-container ${isReflection ? "max-w-2xl" : "max-w-3xl"}`}>
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8">
              <ArrowLeft size={14} /> Voltar ao blog
            </Link>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              {isReflection ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles size={11} /> Reflexão
                </span>
              ) : isLearn ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                  <BookOpen size={11} /> Aprenda
                </span>
              ) : (
                post.category?.name && <span className="category-badge">{post.category.name}</span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(post.publishedAt || post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
              {isLearn && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock size={14} /> {readingMinutes} min de leitura
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye size={14} /> {viewCount}
              </span>
            </div>

            <h1
              className={
                isReflection
                  ? "font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-[1.2] sm:leading-[1.15] break-words"
                  : "font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 leading-tight break-words"
              }
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className={
                  isReflection
                    ? "text-base sm:text-lg md:text-2xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed italic font-light border-l-2 border-purple-500/40 pl-3 sm:pl-4"
                    : "text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed"
                }
              >
                {post.excerpt}
              </p>
            )}

            {/* Table of contents for tutorials */}
            {isLearn && toc.length >= 2 && (
              <nav className="mb-8 sm:mb-10 p-4 sm:p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <List size={16} />
                  <span className="font-heading font-bold text-sm uppercase tracking-wider">Neste tutorial</span>
                </div>
                <ol className="space-y-1.5">
                  {toc.map((item, i) => (
                    <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-foreground/80 hover:text-emerald-400 transition-colors inline-flex gap-2"
                      >
                        {item.level === 2 && <span className="text-muted-foreground tabular-nums">{i + 1}.</span>}
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div
              ref={articleRef}
              className={`blog-content ${
                isReflection
                  ? "prose prose-base sm:prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-heading prose-p:leading-[1.7] sm:prose-p:leading-[1.85] md:prose-p:leading-[1.95] prose-p:text-foreground/90 prose-p:my-5 sm:prose-p:my-6 md:prose-p:my-7 prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-l-purple-500/50 prose-blockquote:bg-purple-500/5 prose-blockquote:py-1 prose-blockquote:px-4 sm:prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-first-letter:text-3xl sm:prose-first-letter:text-4xl md:prose-first-letter:text-5xl prose-first-letter:font-bold prose-first-letter:font-heading prose-first-letter:float-left prose-first-letter:mr-2 prose-first-letter:leading-none prose-first-letter:mt-1"
                  : "prose prose-base sm:prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:scroll-mt-24 prose-a:text-primary prose-img:rounded-xl prose-pre:bg-secondary prose-code:text-emerald-400"
              }`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              <div className="flex items-center mb-4">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                    liked ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary"
                  }`}
                >
                  <Heart size={18} className={liked ? "fill-primary" : ""} />
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-muted-foreground shrink-0" />
                  {post.tags.map((tag) => (
                    <span key={tag.slug} className="px-3 py-1 bg-secondary text-xs sm:text-sm rounded-full text-muted-foreground">{tag.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>

        <NewsletterSection />
      </div>
    </>
  );
};

export default BlogPost;
