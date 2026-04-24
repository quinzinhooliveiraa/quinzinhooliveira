import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useHiddenPages } from "@/hooks/use-page-visibility";
import { useToast } from "@/hooks/use-toast";

const PAGES: { path: string; label: string; description: string }[] = [
  { path: "/sobre", label: "Sobre", description: "Página com sua bio e história" },
  { path: "/blog", label: "Blog", description: "Lista de artigos do blog" },
  { path: "/contato", label: "Contato", description: "Formulário de contato (some também o botão na barra)" },
  { path: "/consultoria", label: "Consultoria", description: "Página de consultoria financeira" },
  { path: "/curso", label: "Curso", description: "Página do curso de redes sociais" },
  { path: "/livro", label: "Livro", description: "Página do livro" },
  { path: "/projetos", label: "Projetos", description: "Lista de projetos" },
  { path: "/conteudo", label: "Conteúdo", description: "Página de conteúdo" },
  { path: "/servicos", label: "Serviços", description: "Página de serviços" },
  { path: "/olivar-global", label: "Olivar Global", description: "Landing page Olivar Global" },
  { path: "/olsproject", label: "OLS Project", description: "Landing page OLS Project" },
  { path: "/vytal", label: "Vytal", description: "Landing page Vytal" },
  { path: "/casados20", label: "Casa dos 20", description: "Landing page Casa dos 20" },
];

export default function PagesTab() {
  const { hidden, loading, setHidden } = useHiddenPages();
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  const toggle = async (path: string) => {
    setSaving(path);
    const next = hidden.includes(path) ? hidden.filter((p) => p !== path) : [...hidden, path];
    try {
      await setHidden(next);
      toast({ title: hidden.includes(path) ? "Página visível" : "Página ocultada" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(null);
  };

  if (loading) return <div className="py-16 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold mb-1">Visibilidade das páginas</h2>
        <p className="text-sm text-muted-foreground">
          Esconda páginas do público. Você (admin) continua vendo todas. As ocultas somem do menu e quem tentar
          acessar a URL é redirecionado para a Início.
        </p>
      </div>

      <div className="space-y-2">
        {PAGES.map((p) => {
          const isHidden = hidden.includes(p.path);
          const isSaving = saving === p.path;
          return (
            <div
              key={p.path}
              className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
                isHidden ? "bg-secondary/30 border-border" : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-heading font-bold text-sm ${isHidden ? "line-through text-muted-foreground" : ""}`}>
                    {p.label}
                  </span>
                  <code className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{p.path}</code>
                  {isHidden && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                      Oculta
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              <button
                onClick={() => toggle(p.path)}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
                  isHidden
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {isSaving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : isHidden ? (
                  <><Eye size={12} /> Mostrar</>
                ) : (
                  <><EyeOff size={12} /> Ocultar</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
