import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Trash2, Sparkles, Loader2, Send } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SeoChecklist from "@/components/admin/SeoChecklist";
import TitleSuggestions from "@/components/admin/TitleSuggestions";
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
  const [focusKeyword, setFocusKeyword] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [reindexing, setReindexing] = useState(false);
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const lastSavedSnapshot = useRef<string>("");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!id && title) {
      setSlug(slugify(title));
      if (!metaTitle) setMetaTitle(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, id]);

  const fetchCategoriesAndTags = async () => {
    const [c, t] = await Promise.all([api.get<Category[]>("/categories"), api.get<Tag[]>("/tags")]);
    setCategories(c || []);
    setTags(t || []);
  };

  const fetchPost = async () => {
    const post: any = await api.get(`/admin/posts/${id}`);
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setContent(post.content || "");
      setCoverUrl(post.cover_image_url || post.coverImageUrl || "");
      setCategoryId(post.category_id || post.categoryId || "");
      setMetaTitle(post.meta_title || post.metaTitle || "");
      setMetaDescription(post.meta_description || post.metaDescription || "");
      setFocusKeyword(post.focus_keyword || post.focusKeyword || "");
      setStatus((post.status as "draft" | "published") || "draft");
      setSelectedTags(post.tag_ids || []);
    }
  };

  const reindex = async () => {
    if (!slug) {
      toast({ title: "Salve o post primeiro", variant: "destructive" });
      return;
    }
    setReindexing(true);
    try {
      const url = `https://quinzinhooliveira.com.br/blog/${slug}`;
      await api.post("/admin/seo/reindex", { urls: [url] });
      toast({ title: "Indexação solicitada! 🚀", description: "Bing, Yandex e outros buscadores foram avisados." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
    setReindexing(false);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const created = await api.post<Category>("/admin/categories", { name: newCategory.trim() });
      setCategories((prev) => prev.find((c) => c.id === created.id) ? prev : [...prev, created]);
      setCategoryId(created.id);
      setNewCategory("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    try {
      const created = await api.post<Tag>("/admin/tags", { name: newTag.trim() });
      setTags((prev) => prev.find((t) => t.id === created.id) ? prev : [...prev, created]);
      setSelectedTags((prev) => prev.includes(created.id) ? prev : [...prev, created.id]);
      setNewTag("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await api.upload<{ url: string }>("/admin/upload", file);
      setCoverUrl(res.url);
    } catch (err: any) {
      toast({ title: "Erro no upload", description: err.message, variant: "destructive" });
    }
  };

  const generateSeo = async () => {
    if (!title.trim()) {
      toast({ title: "Escreva um título primeiro", variant: "destructive" });
      return;
    }
    setGeneratingSeo(true);
    try {
      const data: any = await api.post("/admin/generate-seo", { title, content, excerpt });
      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.meta_description) setMetaDescription(data.meta_description);
      if (data.suggested_excerpt && !excerpt) setExcerpt(data.suggested_excerpt);
      if (data.suggested_category && !categoryId) {
        const existingCat = categories.find((c) => c.name.toLowerCase() === data.suggested_category.toLowerCase());
        if (existingCat) {
          setCategoryId(existingCat.id);
        } else {
          const created = await api.post<Category>("/admin/categories", { name: data.suggested_category });
          setCategories((prev) => [...prev, created]);
          setCategoryId(created.id);
        }
      }
      if (Array.isArray(data.suggested_tags)) {
        for (const tagName of data.suggested_tags) {
          const existing = tags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
          if (existing) {
            setSelectedTags((prev) => prev.includes(existing.id) ? prev : [...prev, existing.id]);
          } else {
            const created = await api.post<Tag>("/admin/tags", { name: tagName });
            setTags((prev) => [...prev, created]);
            setSelectedTags((prev) => [...prev, created.id]);
          }
        }
      }
      toast({ title: "SEO otimizado! ✨" });
    } catch (err: any) {
      toast({ title: "Erro ao gerar SEO", description: err.message, variant: "destructive" });
    }
    setGeneratingSeo(false);
  };

  const buildBody = (statusOverride?: "draft" | "published") => ({
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim() || null,
    content,
    coverImageUrl: coverUrl || null,
    categoryId: categoryId || null,
    metaTitle: metaTitle.trim() || title.trim(),
    metaDescription: metaDescription.trim() || excerpt.trim() || null,
    focusKeyword: focusKeyword.trim() || null,
    status: statusOverride || status,
    tagIds: selectedTags,
  });

  const handleSave = async (publishStatus?: "draft" | "published") => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Título e slug são obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    const finalStatus = publishStatus || status;
    const body = buildBody(finalStatus);

    try {
      let postId = id;
      if (id) {
        await api.patch(`/admin/posts/${id}`, body);
      } else {
        const created: any = await api.post("/admin/posts", body);
        postId = created.id;
      }
      toast({ title: finalStatus === "published" ? "Post publicado! 🎉" : "Rascunho salvo!" });
      setStatus(finalStatus);
      lastSavedSnapshot.current = JSON.stringify(body);
      setAutoSavedAt(new Date());
      if (!id && postId) navigate(`/admin/post/${postId}`);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  // Autosave: every 30s of activity, silently save (keeps current status — never auto-publishes)
  useEffect(() => {
    if (adminLoading || !isAdmin) return;
    if (!title.trim() || !slug.trim()) return;
    const body = buildBody(status);
    const snapshot = JSON.stringify(body);
    if (snapshot === lastSavedSnapshot.current) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      // Re-check the snapshot still matches (debounce protection)
      if (saving || autoSaving) return;
      setAutoSaving(true);
      try {
        let postId = id;
        if (id) {
          await api.patch(`/admin/posts/${id}`, body);
        } else {
          const created: any = await api.post("/admin/posts", body);
          postId = created.id;
        }
        lastSavedSnapshot.current = snapshot;
        setAutoSavedAt(new Date());
        if (!id && postId) navigate(`/admin/post/${postId}`, { replace: true });
      } catch {
        /* silent — user can still save manually */
      }
      setAutoSaving(false);
    }, 30_000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, excerpt, content, coverUrl, categoryId, metaTitle, metaDescription, focusKeyword, status, selectedTags, id, isAdmin, adminLoading]);

  // Save on tab close / browser exit if there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!title.trim() || !slug.trim()) return;
      const snapshot = JSON.stringify(buildBody(status));
      if (snapshot !== lastSavedSnapshot.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, excerpt, content, coverUrl, categoryId, metaTitle, metaDescription, focusKeyword, status, selectedTags]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      await api.del(`/admin/posts/${id}`);
      toast({ title: "Post excluído" });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  if (adminLoading) return <div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="gap-2">
              <ArrowLeft size={18} /> Voltar
            </Button>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              {autoSaving ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Salvando…
                </>
              ) : autoSavedAt ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Salvo às {autoSavedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </>
              ) : (
                <span className="opacity-70">Auto-salvamento ativo</span>
              )}
            </span>
          </div>
          {/* Desktop action bar */}
          <div className="hidden sm:flex items-center gap-2">
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
            {id && status === "published" && (
              <Button
                variant="outline"
                onClick={reindex}
                disabled={reindexing}
                className="gap-2"
                title="Solicita re-indexação imediata aos buscadores via IndexNow"
              >
                {reindexing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Re-indexar
              </Button>
            )}
          </div>
        </div>

        {/* Mobile sticky bottom action bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving} className="gap-1 flex-1">
            <Save size={14} /> Rascunho
          </Button>
          <Button size="sm" onClick={() => handleSave("published")} disabled={saving} className="gap-1 flex-1">
            <Eye size={14} /> Publicar
          </Button>
          {id && (
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive p-2">
              <Trash2 size={16} />
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <div className="space-y-6 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do post"
              className="w-full text-2xl sm:text-3xl font-heading font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
            />
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Palavra-chave foco</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="ex: investir 1000 reais"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Termo principal pelo qual você quer ranquear no Google. As checagens de SEO usam esse termo.
              </p>
            </div>

            <TitleSuggestions baseTitle={title} focusKeyword={focusKeyword} onApply={(t) => { setTitle(t); if (!metaTitle || metaTitle === title) setMetaTitle(t); }} />

            <SeoChecklist
              title={title}
              slug={slug}
              excerpt={excerpt}
              content={content}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              focusKeyword={focusKeyword}
              coverUrl={coverUrl}
              category={categories.find((c) => c.id === categoryId)?.name || ""}
              tagsCount={selectedTags.length}
            />

            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

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

            <div className="p-4 bg-card border border-border rounded-lg space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Imagem de Capa</label>
              {coverUrl && (
                <img src={coverUrl} alt="Capa" className="w-full h-40 object-cover rounded-md mb-2" />
              )}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="text-sm" />
            </div>

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
