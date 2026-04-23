import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, Calendar, Tag, Eye, Heart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewsletterSection from "@/components/NewsletterSection";
import { Helmet } from "react-helmet-async";
import { getSessionId } from "@/hooks/use-session-id";

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
  const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: pageDescription,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.createdAt,
    author: { "@type": "Person", name: "Quinzinho Oliveira" },
    publisher: { "@type": "Organization", name: "Quinzinho" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post.coverImageUrl && <meta property="og:image" content={post.coverImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {post.coverImageUrl && <meta name="twitter:image" content={post.coverImageUrl} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="pt-16">
        {post.coverImageUrl && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <article className="py-12 md:py-16">
          <div className="section-container max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={14} /> Voltar ao blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category?.name && <span className="category-badge">{post.category.name}</span>}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(post.publishedAt || post.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye size={14} /> {viewCount}
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-4">
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
                  <Tag size={16} className="text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span key={tag.slug} className="px-3 py-1 bg-secondary text-sm rounded-full text-muted-foreground">{tag.name}</span>
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
