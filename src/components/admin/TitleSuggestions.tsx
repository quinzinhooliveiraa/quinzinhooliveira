import { useMemo, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

type Props = {
  baseTitle: string;
  focusKeyword: string;
  onApply: (title: string) => void;
};

const CURRENT_YEAR = new Date().getFullYear();

const TEMPLATES: ((kw: string, base: string) => string)[] = [
  (kw) => `Como ${kw} em ${CURRENT_YEAR}: guia completo`,
  (kw) => `${kw}: 7 passos práticos para começar agora`,
  (kw) => `${capitalize(kw)} sem erros: o que ninguém te conta`,
  (kw) => `Tudo sobre ${kw} em ${CURRENT_YEAR} (com exemplos reais)`,
  (kw) => `O guia definitivo de ${kw} para iniciantes`,
  (kw) => `${capitalize(kw)}: o que funciona (e o que evitar)`,
  (kw) => `5 erros que destroem seu ${kw} — e como evitar`,
  (kw) => `${capitalize(kw)} na prática: passo a passo simples`,
  (kw) => `Por que ${kw} mudou tudo (e como aproveitar)`,
  (kw, base) => (base ? `${capitalize(base.split(":")[0])}: ${kw} explicado de forma simples` : `${capitalize(kw)} explicado de forma simples`),
  (kw) => `Quanto custa ${kw}? O que pesquisei em ${CURRENT_YEAR}`,
  (kw) => `${capitalize(kw)}: a estratégia que uso para crescer`,
];

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fitTo60(s: string): string {
  if (s.length <= 60) return s;
  const truncated = s.slice(0, 60);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated;
}

export default function TitleSuggestions({ baseTitle, focusKeyword, onApply }: Props) {
  const [shuffleKey, setShuffleKey] = useState(0);

  const suggestions = useMemo(() => {
    const kw = focusKeyword.trim() || extractKeyword(baseTitle);
    if (!kw) return [];
    const generated = TEMPLATES.map((t) => fitTo60(t(kw, baseTitle))).filter(
      (s, i, arr) => arr.indexOf(s) === i && s !== baseTitle
    );
    // Pseudo-random shuffle that depends on shuffleKey
    const sorted = [...generated].sort((a, b) => {
      const ha = hash(a + shuffleKey);
      const hb = hash(b + shuffleKey);
      return ha - hb;
    });
    return sorted.slice(0, 6);
  }, [baseTitle, focusKeyword, shuffleKey]);

  if (suggestions.length === 0) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={14} /> Sugestões de Título
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Escreva um título ou defina uma palavra-chave foco para receber sugestões otimizadas para o Google.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card border border-border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={14} /> Sugestões de Título
        </label>
        <button
          type="button"
          onClick={() => setShuffleKey((k) => k + 1)}
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <RefreshCw size={12} /> Outras
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground">Clique para usar como título do post.</p>
      <div className="space-y-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onApply(s)}
            className="w-full text-left text-xs px-3 py-2 rounded-md bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="block">{s}</span>
            <span className="block text-[10px] text-muted-foreground mt-0.5">{s.length} caracteres</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function extractKeyword(title: string): string {
  if (!title) return "";
  const words = title
    .toLowerCase()
    .replace(/[^a-záéíóúâêôãõç0-9\s-]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (words.length === 0) return title.toLowerCase();
  return words.slice(0, 3).join(" ");
}

const STOPWORDS = new Set([
  "como",
  "para",
  "com",
  "sem",
  "que",
  "uma",
  "umas",
  "uns",
  "dos",
  "das",
  "pelo",
  "pela",
  "pelos",
  "pelas",
  "este",
  "esta",
  "esses",
  "essas",
  "isto",
  "isso",
  "aquilo",
  "mais",
  "menos",
  "muito",
  "pouco",
  "quando",
  "onde",
  "porque",
  "porquê",
  "tudo",
  "nada",
  "algum",
  "alguns",
  "todos",
  "todas",
  "ainda",
  "também",
  "então",
  "depois",
  "antes",
  "sobre",
  "entre",
  "pelo",
]);

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}
