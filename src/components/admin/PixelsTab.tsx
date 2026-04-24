import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Trash2, ChevronDown, ChevronRight, Save, Loader2, Target, AlertCircle,
} from "lucide-react";

interface PixelRow {
  id: string;
  route: string;
  label: string;
  enabled: boolean;
  facebookPixelId: string | null;
  tiktokPixelId: string | null;
  gaMeasurementId: string | null;
  gtmId: string | null;
  customHead: string | null;
  customBodyEnd: string | null;
}

const SUGGESTED_ROUTES: { route: string; label: string }[] = [
  { route: "/", label: "Página inicial" },
  { route: "/vytal", label: "Vytal" },
  { route: "/casados20", label: "Casa dos 20" },
  { route: "/olivar-global", label: "Olivar Global" },
  { route: "/olsproject", label: "OLS Project" },
  { route: "/livro", label: "Livro" },
  { route: "/curso", label: "Curso" },
  { route: "/consultoria", label: "Consultoria" },
  { route: "/sobre", label: "Sobre" },
  { route: "/blog", label: "Blog" },
  { route: "/contato", label: "Contato" },
  { route: "/projetos", label: "Projetos" },
  { route: "/servicos", label: "Serviços" },
  { route: "/conteudo", label: "Conteúdo" },
];

function emptyRow(): Partial<PixelRow> {
  return {
    route: "",
    label: "",
    enabled: true,
    facebookPixelId: "",
    tiktokPixelId: "",
    gaMeasurementId: "",
    gtmId: "",
    customHead: "",
    customBodyEnd: "",
  };
}

function badgeCount(p: Partial<PixelRow>) {
  return [p.facebookPixelId, p.tiktokPixelId, p.gaMeasurementId, p.gtmId, p.customHead, p.customBodyEnd].filter(
    (v) => v && String(v).trim()
  ).length;
}

function PixelEditor({
  initial,
  onSaved,
  onCancel,
  onDelete,
}: {
  initial: Partial<PixelRow>;
  onSaved: (row: PixelRow) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Partial<PixelRow>>(initial);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const set = <K extends keyof PixelRow>(k: K, v: PixelRow[K] | string | boolean | null) =>
    setForm((f) => ({ ...f, [k]: v as any }));

  const save = async () => {
    if (!form.route?.trim() || !form.label?.trim()) {
      toast({ title: "Preencha o nome e a rota", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const row = await api.put<PixelRow>("/admin/pixels", form);
      toast({ title: "Pixels salvos" });
      onSaved(row);
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 p-5 bg-secondary/30 border-t border-border">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Nome da página</Label>
          <Input
            value={form.label || ""}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Ex: Vytal"
          />
        </div>
        <div>
          <Label className="text-xs">Rota (URL)</Label>
          <Input
            value={form.route || ""}
            onChange={(e) => set("route", e.target.value)}
            placeholder="/vytal"
            className="font-mono"
          />
          <p className="text-[10px] text-muted-foreground mt-1">Exatamente como aparece na URL, com a barra inicial</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
        <div>
          <Label className="text-sm">Ativo</Label>
          <p className="text-[11px] text-muted-foreground">Quando desligado, nenhum pixel é carregado nessa página</p>
        </div>
        <Switch checked={form.enabled !== false} onCheckedChange={(v) => set("enabled", v)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500" /> Meta Pixel (Facebook/Instagram)
          </Label>
          <Input
            value={form.facebookPixelId || ""}
            onChange={(e) => set("facebookPixelId", e.target.value)}
            placeholder="123456789012345"
            className="font-mono"
          />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground" /> TikTok Pixel
          </Label>
          <Input
            value={form.tiktokPixelId || ""}
            onChange={(e) => set("tiktokPixelId", e.target.value)}
            placeholder="C12ABCDEFGHIJKLMNO"
            className="font-mono"
          />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Google Analytics 4 (Measurement ID)
          </Label>
          <Input
            value={form.gaMeasurementId || ""}
            onChange={(e) => set("gaMeasurementId", e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="font-mono"
          />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Google Tag Manager
          </Label>
          <Input
            value={form.gtmId || ""}
            onChange={(e) => set("gtmId", e.target.value)}
            placeholder="GTM-XXXXXXX"
            className="font-mono"
          />
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium flex items-center gap-1.5 select-none">
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
          Avançado: scripts customizados
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <Label className="text-xs">Código extra no &lt;head&gt;</Label>
            <Textarea
              value={form.customHead || ""}
              onChange={(e) => set("customHead", e.target.value)}
              placeholder={`/* JavaScript inline (sem tags <script>) */\nconsole.log('carregado');`}
              className="font-mono text-xs min-h-[100px]"
            />
            <p className="text-[10px] text-muted-foreground mt-1">JavaScript puro, sem as tags &lt;script&gt;</p>
          </div>
          <div>
            <Label className="text-xs">HTML extra no fim do &lt;body&gt;</Label>
            <Textarea
              value={form.customBodyEnd || ""}
              onChange={(e) => set("customBodyEnd", e.target.value)}
              placeholder={`<script>...</script>\n<noscript>...</noscript>`}
              className="font-mono text-xs min-h-[100px]"
            />
            <p className="text-[10px] text-muted-foreground mt-1">HTML completo, incluindo as tags</p>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-amber-600 dark:text-amber-500 bg-amber-500/10 p-2.5 rounded-md">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>Cuidado: scripts customizados rodam com acesso total à página. Use apenas códigos confiáveis.</span>
          </div>
        </div>
      </details>

      <div className="flex items-center justify-between gap-2 pt-2">
        <div>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 size={14} className="mr-1.5" /> Remover
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PixelsTab() {
  const [rows, setRows] = useState<PixelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<Partial<PixelRow>>(emptyRow());
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get<PixelRow[]>("/admin/pixels");
      setRows(data);
    } catch (e: any) {
      toast({ title: "Erro ao carregar", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Remover esses pixels da página?")) return;
    try {
      await api.delete(`/admin/pixels/${id}`);
      setRows((r) => r.filter((x) => x.id !== id));
      toast({ title: "Removido" });
    } catch (e: any) {
      toast({ title: "Erro ao remover", description: e.message, variant: "destructive" });
    }
  };

  const usedRoutes = new Set(rows.map((r) => r.route));
  const suggestedNew = SUGGESTED_ROUTES.filter((s) => !usedRoutes.has(s.route));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1 flex items-center gap-2">
          <Target size={20} className="text-primary" /> Pixels e tracking por página
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure Meta Pixel, TikTok Pixel, Google Analytics, GTM ou scripts customizados para cada landing page
          individualmente. Eles só carregam na rota configurada.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Carregando...</div>
      ) : (
        <>
          {/* Existing configs */}
          <div className="space-y-2">
            {rows.length === 0 && !adding && (
              <div className="text-sm text-muted-foreground bg-card border border-dashed border-border rounded-xl p-8 text-center">
                Nenhuma página configurada ainda. Clique em "Adicionar página" abaixo.
              </div>
            )}
            {rows.map((row) => {
              const open = openId === row.id;
              const count = badgeCount(row);
              return (
                <div key={row.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(open ? null : row.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
                  >
                    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold">{row.label}</span>
                        <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {row.route}
                        </code>
                        {!row.enabled && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                            desligado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {count === 0 ? "sem pixels configurados" : `${count} ${count === 1 ? "pixel" : "pixels"} ativos`}
                      </p>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {row.facebookPixelId && (
                        <span className="w-2 h-2 rounded-full bg-pink-500" title="Meta Pixel" />
                      )}
                      {row.tiktokPixelId && (
                        <span className="w-2 h-2 rounded-full bg-foreground" title="TikTok Pixel" />
                      )}
                      {row.gaMeasurementId && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Google Analytics" />
                      )}
                      {row.gtmId && <span className="w-2 h-2 rounded-full bg-blue-500" title="GTM" />}
                      {(row.customHead || row.customBodyEnd) && (
                        <span className="w-2 h-2 rounded-full bg-purple-500" title="Custom" />
                      )}
                    </div>
                  </button>
                  {open && (
                    <PixelEditor
                      initial={row}
                      onSaved={(saved) => {
                        setRows((rs) => rs.map((r) => (r.id === saved.id ? saved : r)));
                        setOpenId(null);
                      }}
                      onCancel={() => setOpenId(null)}
                      onDelete={() => remove(row.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* New */}
          {adding ? (
            <div className="bg-card border border-primary/40 rounded-xl overflow-hidden">
              <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                <span className="font-bold text-sm">Nova configuração</span>
              </div>
              <PixelEditor
                initial={newDraft}
                onSaved={(saved) => {
                  setRows((rs) => [...rs, saved]);
                  setAdding(false);
                  setNewDraft(emptyRow());
                }}
                onCancel={() => {
                  setAdding(false);
                  setNewDraft(emptyRow());
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Button onClick={() => setAdding(true)}>
                <Plus size={16} className="mr-1.5" /> Adicionar página
              </Button>
              {suggestedNew.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground py-1">Sugestões rápidas:</span>
                  {suggestedNew.slice(0, 8).map((s) => (
                    <button
                      key={s.route}
                      onClick={() => {
                        setNewDraft({ ...emptyRow(), route: s.route, label: s.label });
                        setAdding(true);
                      }}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/70 transition-colors"
                    >
                      {s.label}
                      <span className="text-muted-foreground ml-1.5 font-mono">{s.route}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
