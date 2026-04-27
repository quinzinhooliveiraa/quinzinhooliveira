import { useMemo } from "react";
import { Check, X, AlertCircle, Gauge } from "lucide-react";

type Props = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  coverUrl: string;
  category: string;
  tagsCount: number;
};

type CheckResult = {
  ok: "good" | "warn" | "bad";
  label: string;
  hint?: string;
  weight: number;
};

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countOccurrences(haystack: string, needle: string): number {
  if (!haystack || !needle) return 0;
  const h = normalize(haystack);
  const n = normalize(needle);
  if (!n) return 0;
  let count = 0;
  let i = 0;
  while ((i = h.indexOf(n, i)) !== -1) {
    count++;
    i += n.length;
  }
  return count;
}

export default function SeoChecklist(props: Props) {
  const { title, slug, excerpt, content, metaTitle, metaDescription, focusKeyword, coverUrl, category, tagsCount } = props;

  const data = useMemo(() => {
    const text = stripHtml(content);
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const h2Count = (content.match(/<h2[\s>]/gi) || []).length;
    const h3Count = (content.match(/<h3[\s>]/gi) || []).length;
    const imageMatches = content.match(/<img[^>]*>/gi) || [];
    const imagesWithAlt = imageMatches.filter((tag) => /\salt\s*=\s*["'][^"']+["']/i.test(tag)).length;
    const imagesTotal = imageMatches.length;
    const linkCount = (content.match(/<a\s[^>]*href/gi) || []).length;
    const kw = focusKeyword.trim();

    const checks: CheckResult[] = [];

    // Title length 50-60
    checks.push({
      label: `Título tem ${title.length} caracteres`,
      ok: title.length >= 50 && title.length <= 60 ? "good" : title.length >= 30 && title.length <= 70 ? "warn" : "bad",
      hint: "Ideal: 50–60 caracteres. Títulos nesse intervalo aparecem completos no Google.",
      weight: 8,
    });

    // Meta description 120-160
    checks.push({
      label: `Meta descrição tem ${metaDescription.length} caracteres`,
      ok:
        metaDescription.length >= 120 && metaDescription.length <= 160
          ? "good"
          : metaDescription.length >= 70 && metaDescription.length <= 180
          ? "warn"
          : "bad",
      hint: "Ideal: 120–160 caracteres. Resume o post e convida o leitor a clicar.",
      weight: 8,
    });

    // Slug
    const slugOk = !!slug && slug.length <= 75 && /^[a-z0-9-]+$/.test(slug);
    checks.push({
      label: slug ? `Slug “${slug}”` : "Sem slug",
      ok: slugOk ? "good" : slug ? "warn" : "bad",
      hint: "Use apenas letras minúsculas, números e hífens. Mantenha curto (3–5 palavras).",
      weight: 6,
    });

    // Cover image
    checks.push({
      label: coverUrl ? "Imagem de capa definida" : "Sem imagem de capa",
      ok: coverUrl ? "good" : "bad",
      hint: "A capa aparece no Google Discover, redes sociais e WhatsApp. Use 1200×630px.",
      weight: 7,
    });

    // Excerpt
    checks.push({
      label: excerpt ? `Resumo com ${excerpt.length} caracteres` : "Sem resumo",
      ok: excerpt.length >= 80 && excerpt.length <= 200 ? "good" : excerpt ? "warn" : "bad",
      hint: "O resumo aparece nos cards do blog e ajuda o leitor a entender o conteúdo.",
      weight: 4,
    });

    // Category
    checks.push({
      label: category ? `Categoria: ${category}` : "Sem categoria",
      ok: category ? "good" : "warn",
      hint: "Categorias ajudam o Google a entender a estrutura do seu site.",
      weight: 3,
    });

    // Tags
    checks.push({
      label: `${tagsCount} tag(s) selecionada(s)`,
      ok: tagsCount >= 3 ? "good" : tagsCount >= 1 ? "warn" : "bad",
      hint: "Use 3–5 tags relevantes ao tema do post.",
      weight: 3,
    });

    // Word count
    checks.push({
      label: `Conteúdo tem ${wordCount} palavras`,
      ok: wordCount >= 800 ? "good" : wordCount >= 300 ? "warn" : "bad",
      hint: "Posts com 800+ palavras tendem a ranquear melhor. Mínimo recomendado: 300.",
      weight: 8,
    });

    // H2 headings
    checks.push({
      label: `${h2Count} subtítulo(s) H2 e ${h3Count} H3`,
      ok: h2Count >= 2 ? "good" : h2Count >= 1 ? "warn" : "bad",
      hint: "Use H2 para dividir o post em seções. Facilita a leitura e o ranqueamento.",
      weight: 6,
    });

    // Images with alt
    if (imagesTotal === 0) {
      checks.push({
        label: "Nenhuma imagem no conteúdo",
        ok: "warn",
        hint: "Adicione 1–3 imagens ilustrativas para enriquecer o post.",
        weight: 4,
      });
    } else {
      checks.push({
        label: `${imagesWithAlt} de ${imagesTotal} imagens com alt text`,
        ok: imagesWithAlt === imagesTotal ? "good" : "warn",
        hint: "Toda imagem deve ter alt text descritivo (acessibilidade + SEO).",
        weight: 4,
      });
    }

    // Links
    checks.push({
      label: `${linkCount} link(s) no conteúdo`,
      ok: linkCount >= 2 ? "good" : linkCount >= 1 ? "warn" : "bad",
      hint: "Inclua links internos (outros posts seus) e externos (fontes confiáveis).",
      weight: 4,
    });

    // Focus keyword presence
    if (!kw) {
      checks.push({
        label: "Defina uma palavra-chave foco",
        ok: "bad",
        hint: "É o termo principal pelo qual você quer ranquear. Ex: “investir 1000 reais”.",
        weight: 10,
      });
    } else {
      const inTitle = countOccurrences(title, kw) > 0;
      const inMetaTitle = countOccurrences(metaTitle, kw) > 0;
      const inMetaDesc = countOccurrences(metaDescription, kw) > 0;
      const inSlug = countOccurrences(slug.replace(/-/g, " "), kw) > 0;
      const inExcerpt = countOccurrences(excerpt, kw) > 0;
      const inFirst100 = countOccurrences(words.slice(0, 100).join(" "), kw) > 0;
      const inH2 = (content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).some((b) => countOccurrences(stripHtml(b), kw) > 0);
      const total = countOccurrences(text, kw);
      const density = wordCount > 0 ? (total / wordCount) * 100 : 0;

      checks.push({
        label: `Palavra-chave no título`,
        ok: inTitle ? "good" : "bad",
        hint: `Inclua “${kw}” no título principal.`,
        weight: 8,
      });
      checks.push({
        label: `Palavra-chave no meta título`,
        ok: inMetaTitle ? "good" : "warn",
        hint: `Inclua “${kw}” no meta título (aparece na aba do Google).`,
        weight: 5,
      });
      checks.push({
        label: `Palavra-chave na meta descrição`,
        ok: inMetaDesc ? "good" : "warn",
        hint: `Inclua “${kw}” na meta descrição.`,
        weight: 5,
      });
      checks.push({
        label: `Palavra-chave no slug`,
        ok: inSlug ? "good" : "warn",
        hint: `Inclua “${kw}” na URL.`,
        weight: 5,
      });
      checks.push({
        label: `Palavra-chave no resumo`,
        ok: inExcerpt ? "good" : "warn",
        hint: `Inclua “${kw}” no resumo.`,
        weight: 3,
      });
      checks.push({
        label: `Palavra-chave nas primeiras 100 palavras`,
        ok: inFirst100 ? "good" : "warn",
        hint: `O Google dá peso ao que aparece no início do texto.`,
        weight: 6,
      });
      checks.push({
        label: `Palavra-chave em algum subtítulo (H2)`,
        ok: inH2 ? "good" : "warn",
        hint: `Use a palavra-chave em pelo menos um subtítulo.`,
        weight: 4,
      });
      checks.push({
        label: `Densidade da palavra-chave: ${density.toFixed(2)}%`,
        ok: density >= 0.5 && density <= 2.5 ? "good" : density > 0 && density <= 4 ? "warn" : "bad",
        hint: "Ideal: 0,5%–2,5%. Acima disso, o Google considera spam.",
        weight: 5,
      });
    }

    const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
    const earned = checks.reduce((s, c) => s + c.weight * (c.ok === "good" ? 1 : c.ok === "warn" ? 0.5 : 0), 0);
    const score = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;

    return { checks, score };
  }, [title, slug, excerpt, content, metaTitle, metaDescription, focusKeyword, coverUrl, category, tagsCount]);

  const scoreColor =
    data.score >= 80 ? "text-emerald-500" : data.score >= 60 ? "text-amber-500" : data.score >= 40 ? "text-orange-500" : "text-destructive";
  const scoreBg =
    data.score >= 80 ? "bg-emerald-500" : data.score >= 60 ? "bg-amber-500" : data.score >= 40 ? "bg-orange-500" : "bg-destructive";
  const scoreLabel =
    data.score >= 80 ? "Excelente" : data.score >= 60 ? "Bom" : data.score >= 40 ? "Precisa melhorar" : "Ruim";

  return (
    <div className="p-4 bg-card border border-border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Gauge size={14} /> SEO Score
        </label>
        <span className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`text-3xl font-bold ${scoreColor}`}>{data.score}</div>
        <div className="flex-1">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full ${scoreBg} transition-all`} style={{ width: `${data.score}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Pontuação baseada em boas práticas do Google.</p>
        </div>
      </div>

      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
        {data.checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-xs group">
            <span className="mt-0.5 shrink-0">
              {c.ok === "good" ? (
                <Check size={14} className="text-emerald-500" />
              ) : c.ok === "warn" ? (
                <AlertCircle size={14} className="text-amber-500" />
              ) : (
                <X size={14} className="text-destructive" />
              )}
            </span>
            <div className="flex-1">
              <p className={`${c.ok === "good" ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</p>
              {c.ok !== "good" && c.hint && (
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{c.hint}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
