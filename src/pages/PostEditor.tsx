import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Trash2, Sparkles, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useAdmin } from "@/hooks/use-admin";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);

  useEffect(() => {
    fetchCategoriesAndTags();
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id && title) {
      setSlug(slugify(title));
      if (!metaTitle) setMetaTitle(title);
    }
  }, [title, id]);

  const fetchCategoriesAndTags = async () => {
    const [catRes, tagRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("tags").select("*").order("name"),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (tagRes.data) setTags(tagRes.data);
  };

  const fetchPost = async () => {
    const { data: post } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id!)
      .single();

    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setContent(post.content);
      setCoverUrl(post.cover_image_url || "");
      setCategoryId(post.category_id || "");
      setMetaTitle(post.meta_title || "");
      setMetaDescription(post.meta_description || "");
      setStatus(post.status as "draft" | "published");
    }

    const { data: postTags } = await supabase
      .from("post_tags")
      .select("tag_id")
      .eq("post_id", id!);

    if (postTags) setSelectedTags(postTags.map((pt) => pt.tag_id));
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategory.trim(), slug: slugify(newCategory) })
      .select()
      .single();
    if (data) {
      setCategories((prev) => [...prev, data]);
      setCategoryId(data.id);
      setNewCategory("");
    }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const { data, error } = await supabase
      .from("tags")
      .insert({ name: newTag.trim(), slug: slugify(newTag) })
      .select()
      .single();
    if (data) {
      setTags((prev) => [...prev, data]);
      setSelectedTags((prev) => [...prev, data.id]);
      setNewTag("");
    }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
    setCoverUrl(publicUrl);
  };

  const generateSeo = async () => {
    if (!title.trim()) {
      toast({ title: "Escreva um título primeiro", variant: "destructive" });
      return;
    }
    setGeneratingSeo(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo", {
        body: { title, content, excerpt },
      });
      if (error) throw error;
      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.meta_description) setMetaDescription(data.meta_description);
      if (data.suggested_excerpt && !excerpt) setExcerpt(data.suggested_excerpt);
      // Auto-create/select category
      if (data.suggested_category && !categoryId) {
        const existingCat = categories.find((c) => c.name.toLowerCase() === data.suggested_category.toLowerCase());
        if (existingCat) {
          setCategoryId(existingCat.id);
        } else {
          const { data: newCatData } = await supabase
            .from("categories")
            .insert({ name: data.suggested_category, slug: slugify(data.suggested_category) })
            .select()
            .single();
          if (newCatData) {
            setCategories((prev) => [...prev, newCatData]);
            setCategoryId(newCatData.id);
          }
        }
      }
      if (data.suggested_tags && Array.isArray(data.suggested_tags)) {
        for (const tagName of data.suggested_tags) {
          const existing = tags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
          if (existing) {
            setSelectedTags((prev) => prev.includes(existing.id) ? prev : [...prev, existing.id]);
          } else {
            const { data: newTagData } = await supabase
              .from("tags")
              .insert({ name: tagName, slug: slugify(tagName) })
              .select()
              .single();
            if (newTagData) {
              setTags((prev) => [...prev, newTagData]);
              setSelectedTags((prev) => [...prev, newTagData.id]);
            }
          }
        }
      }
      toast({ title: "SEO otimizado! ✨" });
    } catch (err: any) {
      toast({ title: "Erro ao gerar SEO", description: err.message, variant: "destructive" });
    }
    setGeneratingSeo(false);
  };

  const handleSave = async (publishStatus?: "draft" | "published") => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Título e slug são obrigatórios", variant: "destructive" });
      return;
    }

    setSaving(true);
    const finalStatus = publishStatus || status;
    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      cover_image_url: coverUrl || null,
      category_id: categoryId || null,
      meta_title: metaTitle.trim() || title.trim(),
      meta_description: metaDescription.trim() || excerpt.trim() || null,
      status: finalStatus,
      published_at: finalStatus === "published" ? new Date().toISOString() : null,
    };

    let postId = id;

    if (id) {
      const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
      if (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from("blog_posts").insert(postData).select().single();
      if (error) {
        toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      postId = data.id;
    }

    // Sync tags
    if (postId) {
      await supabase.from("post_tags").delete().eq("post_id", postId);
      if (selectedTags.length > 0) {
        await supabase.from("post_tags").insert(
          selectedTags.map((tagId) => ({ post_id: postId!, tag_id: tagId }))
        );
      }
    }

    toast({ title: finalStatus === "published" ? "Post publicado! 🎉" : "Rascunho salvo!" });
    setSaving(false);
    if (!id && postId) navigate(`/admin/post/${postId}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Post excluído" });
    navigate("/admin");
  };

  if (adminLoading) return <div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowLeft size={18} /> Voltar
          </Button>
          <div className="flex items-center gap-2">
            {id && (
              <Button variant="ghost" onClick={handleDelete} className="text-destructive gap-2">
                <Trash2 size={16} /> Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving} className="gap-2">
              <Save size={16} /> Salvar Rascunho
            </Button>
            <Button onClick={() => handleSave("published")} disabled={saving} className="gap-2">
              <Eye size={16} /> Publicar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main editor */}
          <div className="space-y-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do post"
              className="w-full text-3xl font-heading font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
            />

            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Slug */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Excerpt */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resumo</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Breve descrição do post..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Cover image */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Imagem de Capa</label>
              {coverUrl && (
                <img src={coverUrl} alt="Capa" className="w-full h-40 object-cover rounded-md mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="text-sm" />
            </div>

            {/* Category */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nova categoria"
                  className="flex-1 px-3 py-1.5 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                />
                <Button size="sm" variant="outline" onClick={addCategory} type="button">+</Button>
              </div>
            </div>

            {/* Tags */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id]
                      )
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag"
                  className="flex-1 px-3 py-1.5 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button size="sm" variant="outline" onClick={addTag} type="button">+</Button>
              </div>
            </div>

            {/* SEO */}
            <div className="p-4 bg-card border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSeo}
                  disabled={generatingSeo}
                  className="gap-1.5 text-xs"
                  type="button"
                >
                  {generatingSeo ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {generatingSeo ? "Gerando..." : "Auto SEO"}
                </Button>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Meta Título ({metaTitle.length}/60)</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Meta Descrição ({metaDescription.length}/160)</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* SEO Preview */}
              <div className="p-3 bg-background rounded-md border border-border">
                <p className="text-xs text-muted-foreground mb-1">Preview no Google:</p>
                <p className="text-sm text-primary font-medium truncate">{metaTitle || title || "Título do post"}</p>
                <p className="text-xs text-muted-foreground truncate">quinzinho.com/blog/{slug || "slug-do-post"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{metaDescription || excerpt || "Descrição do post..."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
