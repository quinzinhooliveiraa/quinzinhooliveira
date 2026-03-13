import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
}

interface TagData {
  tags: { name: string; slug: string };
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*, categories(name, slug)")
      .eq("slug", slug!)
      .eq("status", "published")
      .single();

    if (data) {
      setPost(data as unknown as PostData);

      const [tagsRes, viewsRes, likesRes] = await Promise.all([
        supabase.from("post_tags").select("tags(name, slug)").eq("post_id", data.id),
        supabase.from("post_views").select("id", { count: "exact", head: true }).eq("post_id", data.id),
        supabase.from("post_likes").select("id, session_id", { count: "exact" }).eq("post_id", data.id),
      ]);

      if (tagsRes.data) {
        setTags((tagsRes.data as unknown as TagData[]).map((pt) => pt.tags.name));
      }

      setViewCount(viewsRes.count || 0);
      setLikeCount(likesRes.count || 0);

      const sessionId = getSessionId();
      const alreadyLiked = likesRes.data?.some((l: any) => l.session_id === sessionId);
      setLiked(!!alreadyLiked);

      // Track view
      await supabase.from("post_views").insert({ post_id: data.id, session_id: sessionId });
      setViewCount((c) => c + 1);
    }
    setLoading(false);
  };

  const toggleLike = async () => {
    if (!post) return;
    const sessionId = getSessionId();
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("session_id", sessionId);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, session_id: sessionId });
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

  const pageTitle = post.meta_title || post.title;
  const pageDescription = post.meta_description || post.excerpt || "";
  const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: pageDescription,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.created_at,
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
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {post.cover_image_url && <meta name="twitter:image" content={post.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="pt-16">
        {post.cover_image_url && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <article className="py-12 md:py-16">
          <div className="section-container max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={14} /> Voltar ao blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.categories?.name && <span className="category-badge">{post.categories.name}</span>}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                {format(new Date(post.published_at || post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
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

            {/* Like + Tags */}
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

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={16} className="text-muted-foreground" />
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-sm rounded-full text-muted-foreground">{tag}</span>
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
