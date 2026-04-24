import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { Plus, FileText, Eye, Pencil, LogOut, Calendar, Mail, Trash2, CheckCircle, UserPlus, Send, BarChart3, Layout, Target } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import PagesTab from "@/components/admin/PagesTab";
import PixelsTab from "@/components/admin/PixelsTab";
import PwaNotificationsCard from "@/components/admin/PwaNotificationsCard";
import { useVisitNotifications } from "@/hooks/use-visit-notifications";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  categories: { name: string } | null;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  source: string;
}

const SOURCE_LABELS: Record<string, string> = {
  contato: "Contato",
  consultoria: "Consultoria",
  curso: "Curso",
  newsletter: "Newsletter",
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
  const [invitePassword, setInvitePassword] = useState("");
  const [inviting, setInviting] = useState(false);

  useVisitNotifications(isAdmin === true);

  useEffect(() => {
    if (isAdmin) {
      api.get<Post[]>("/admin/posts").then((d) => setPosts(d || []));
      api.get<Submission[]>("/admin/contact-submissions").then((d) => setSubmissions(d || []));
    }
  }, [isAdmin]);

  const markAsRead = async (id: string) => {
    await api.patch(`/admin/contact-submissions/${id}`, { read: true });
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)));
  };

  const deleteSubmission = async (id: string) => {
    await api.del(`/admin/contact-submissions/${id}`);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    navigate("/");
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !invitePassword.trim()) {
      toast({ title: "Email e senha obrigatórios", variant: "destructive" });
      return;
    }
    setInviting(true);
    try {
      await api.post("/admin/invite", { email: inviteEmail.trim(), password: invitePassword });
      toast({ title: "Admin criado! ✉️", description: `Adicionado: ${inviteEmail}` });
      setInviteEmail("");
      setInvitePassword("");
    } catch (err: any) {
      toast({ title: "Erro ao convidar", description: err.message, variant: "destructive" });
    }
    setInviting(false);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Painel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie posts, mensagens e admins</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" className="gap-2">Voltar ao Site</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>

        <PwaNotificationsCard />

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
            <TabsTrigger value="pixels" className="gap-2">
              <Target size={16} /> Pixels
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <Layout size={14} /> Páginas
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <UserPlus size={14} /> Admins
            </TabsTrigger>
          </TabsList>

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
                        {format(new Date(post.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
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

          <TabsContent value="messages">
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
                          {format(new Date(sub.createdAt), "d 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
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

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="pixels">
            <PixelsTab />
          </TabsContent>

          <TabsContent value="pages">
            <PagesTab />
          </TabsContent>

          <TabsContent value="admin">
            <div className="max-w-lg">
              <h2 className="font-heading text-xl font-bold mb-2">Adicionar Admin</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Crie credenciais para outro administrador gerenciar posts e mensagens.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email do novo admin"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="password"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  placeholder="Senha temporária"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleInvite} disabled={inviting} className="gap-2 w-full">
                  <Send size={16} /> {inviting ? "Criando..." : "Criar Admin"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Compartilhe o email e a senha com o novo admin. Ele pode redefinir depois.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
