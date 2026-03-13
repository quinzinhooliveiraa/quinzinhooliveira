import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { Plus, FileText, Eye, Pencil, LogOut, Calendar, Mail, Trash2, CheckCircle, UserPlus, Send, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AnalyticsTab from "@/components/admin/AnalyticsTab";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  categories: { name: string } | null;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
  source: string;
}

const SOURCE_LABELS: Record<string, string> = {
  contato: "Contato",
  consultoria: "Consultoria",
  curso: "Curso",
};

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [activeTab, setActiveTab] = useState("posts");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
      fetchSubmissions();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, status, published_at, created_at, categories(name)")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as unknown as Post[]);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data as Submission[]);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ read: true }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)));
  };

  const deleteSubmission = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    const { error } = await supabase.functions.invoke("setup-admin", {
      body: { email: inviteEmail.trim() },
    });
    setInviting(false);
    if (error) {
      toast({ title: "Erro ao convidar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Convite enviado! ✉️", description: `Admin adicionado: ${inviteEmail}` });
      setInviteEmail("");
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const sources = Array.from(new Set(submissions.map((s) => s.source || "contato")));
  const filteredSubmissions = submissions.filter((s) => sourceFilter === "all" || (s.source || "contato") === sourceFilter);
  const unreadCount = submissions.filter((s) => !s.read).length;

  if (adminLoading) return <div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Painel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie posts, mensagens e admins</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                Voltar ao Site
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="posts" className="gap-2">
              <FileText size={14} /> Posts
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <Mail size={14} /> Mensagens
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">{unreadCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 size={14} /> Analytics
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <UserPlus size={14} /> Admins
            </TabsTrigger>
          </TabsList>

          {/* ── Posts Tab ── */}
          <TabsContent value="posts">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["all", "published", "draft"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Rascunhos"}
                    <span className="ml-2 opacity-60">
                      {f === "all" ? posts.length : posts.filter((p) => p.status === f).length}
                    </span>
                  </button>
                ))}
              </div>
              <Button onClick={() => navigate("/admin/post/new")} className="gap-2">
                <Plus size={16} /> Novo Post
              </Button>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <FileText size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-bold mb-2">Nenhum post ainda</h3>
                <p className="text-sm text-muted-foreground mb-6">Comece a escrever seu primeiro artigo</p>
                <Button onClick={() => navigate("/admin/post/new")} className="gap-2">
                  <Plus size={16} /> Criar Primeiro Post
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          post.status === "published" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {post.status === "published" ? "Publicado" : "Rascunho"}
                        </span>
                        {post.categories?.name && (
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{post.categories.name}</span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold truncate">{post.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {format(new Date(post.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {post.status === "published" && (
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="gap-1"><Eye size={14} /> Ver</Button>
                        </Link>
                      )}
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/post/${post.id}`)} className="gap-1">
                        <Pencil size={14} /> Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Messages Tab ── */}
          <TabsContent value="messages">
            {/* Source filter */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSourceFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sourceFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas <span className="ml-1 opacity-60">{submissions.length}</span>
              </button>
              {sources.map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sourceFilter === src ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {SOURCE_LABELS[src] || src} <span className="ml-1 opacity-60">{submissions.filter((s) => (s.source || "contato") === src).length}</span>
                </button>
              ))}
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <Mail size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-bold mb-2">Nenhuma mensagem</h3>
                <p className="text-sm text-muted-foreground">As mensagens aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-4 bg-card border rounded-xl transition-colors ${
                      sub.read ? "border-border" : "border-primary/40 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-heading font-bold text-sm">{sub.name}</span>
                          <span className="text-xs text-muted-foreground">{sub.email}</span>
                          <span className="px-1.5 py-0.5 bg-secondary text-[9px] font-bold rounded uppercase tracking-wider text-muted-foreground">
                            {SOURCE_LABELS[sub.source || "contato"] || sub.source}
                          </span>
                          {!sub.read && <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded">NOVO</span>}
                        </div>
                        {sub.subject && <p className="text-sm font-medium mb-1">{sub.subject}</p>}
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sub.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          {format(new Date(sub.created_at), "d 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!sub.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(sub.id)} className="gap-1 text-xs">
                            <CheckCircle size={14} />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub.id)} className="text-destructive gap-1 text-xs">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Analytics Tab ── */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          {/* ── Admin Invite Tab ── */}
          <TabsContent value="admin">
            <div className="max-w-lg">
              <h2 className="font-heading text-xl font-bold mb-2">Convidar Admin</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Adicione outro administrador para gerenciar posts e mensagens.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email do novo admin"
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleInvite} disabled={inviting} className="gap-2">
                  <Send size={16} /> {inviting ? "Enviando..." : "Convidar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                O usuário precisa ter uma conta cadastrada. O email deve ser o mesmo usado no cadastro.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
