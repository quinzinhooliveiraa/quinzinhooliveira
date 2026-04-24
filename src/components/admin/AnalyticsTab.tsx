import { useState, useEffect, useMemo, useRef } from "react";
import { api } from "@/lib/api";
import {
  Eye, Users, Globe, Smartphone, Monitor, Tablet, Radio, ArrowUp, ArrowDown, FileText, ExternalLink,
  Instagram, Music2, Facebook, Twitter, Linkedin, Youtube, MessageCircle, Send, Search, Link2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import VisitorsMap from "./VisitorsMap";

type Range = "7d" | "30d" | "90d" | "all";

interface MapPoint {
  lat: number;
  lng: number;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  visits: number;
  unique_visitors: number;
}

interface LiveVisitor {
  sessionId: string;
  page: string;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  lat: number | null;
  lng: number | null;
  source: string;
  createdAt: string;
}

interface AnalyticsData {
  range: Range;
  days: number;
  series: { day: string; visits: number; unique_visitors: number }[];
  topPages: { page: string; visits: number; unique_visitors: number }[];
  countries: { country: string; countryCode: string | null; visits: number; unique_visitors: number }[];
  cities: { city: string; country: string; countryCode: string | null; visits: number }[];
  devices: { device: string; visits: number }[];
  browsers: { browser: string; visits: number }[];
  referrers: { source: string; visits: number }[];
  recent: {
    id: string; page: string; country: string | null; countryCode: string | null;
    city: string | null; device: string | null; browser: string | null; source: string; createdAt: string;
  }[];
  mapPoints: MapPoint[];
  liveVisitors: LiveVisitor[];
  totals: {
    totalVisits: number;
    totalUniqueVisitors: number;
    rangeVisits: number;
    rangeUniqueVisitors: number;
    todayVisits: number;
    todayUniqueVisitors: number;
    live: number;
    publishedPosts: number;
    unreadMessages: number;
  };
}

const SOURCE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Instagram, TikTok: Music2, Facebook, "Twitter / X": Twitter, LinkedIn: Linkedin, YouTube: Youtube,
  WhatsApp: MessageCircle, Telegram: Send, Google: Search, Bing: Search, DuckDuckGo: Search,
  Direto: Link2,
};
const SOURCE_COLORS: Record<string, string> = {
  Instagram: "text-pink-500 bg-pink-500/10",
  TikTok: "text-foreground bg-secondary",
  Facebook: "text-blue-600 bg-blue-600/10",
  "Twitter / X": "text-foreground bg-secondary",
  LinkedIn: "text-blue-700 bg-blue-700/10",
  YouTube: "text-red-600 bg-red-600/10",
  WhatsApp: "text-green-600 bg-green-600/10",
  Telegram: "text-sky-500 bg-sky-500/10",
  Google: "text-amber-500 bg-amber-500/10",
  Direto: "text-muted-foreground bg-secondary",
};
function sourceColor(s: string) {
  return SOURCE_COLORS[s] || "text-primary bg-primary/10";
}
function SourceIcon({ source, size = 14 }: { source: string; size?: number }) {
  const Icon = SOURCE_ICONS[source] || Link2;
  return <Icon size={size} />;
}

function flagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => A + (c.charCodeAt(0) - 65)));
}

const DeviceIcon = ({ d }: { d: string }) => {
  if (d === "mobile") return <Smartphone size={14} />;
  if (d === "tablet") return <Tablet size={14} />;
  return <Monitor size={14} />;
};

function StatCard({
  icon, label, value, sub, trend,
}: { icon: React.ReactNode; label: string; value: string | number; sub?: string; trend?: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        {trend != null && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
            trend >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          }`}>
            {trend >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-heading font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function LineChart({ series }: { series: { day: string; visits: number; unique_visitors: number }[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 800;
  const H = 220;
  const PAD_L = 32;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 26;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const max = Math.max(...series.map((s) => s.visits), 4);
  const ticks = 4;

  const x = (i: number) => PAD_L + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;

  const line = series.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(s.visits)}`).join(" ");
  const lineUnique = series.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(s.unique_visitors)}`).join(" ");
  const area = `${line} L ${x(series.length - 1)} ${PAD_T + innerH} L ${x(0)} ${PAD_T + innerH} Z`;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD_L) / innerW) * (series.length - 1));
    if (i >= 0 && i < series.length) setHover(i);
  };

  if (series.length === 0) {
    return <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Sem dados ainda</div>;
  }

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[220px]"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (max / ticks) * (ticks - i);
          const yy = PAD_T + (innerH / ticks) * i;
          return (
            <g key={i}>
              <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 4" />
              <text x={PAD_L - 6} y={yy + 3} fontSize="9" fill="hsl(var(--muted-foreground))" textAnchor="end">
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#aGrad)" />
        <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={lineUnique} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" />

        {series.map((s, i) => {
          const showLabel = series.length <= 14 || i % Math.ceil(series.length / 8) === 0;
          if (!showLabel) return null;
          return (
            <text key={i} x={x(i)} y={H - 8} fontSize="9" fill="hsl(var(--muted-foreground))" textAnchor="middle">
              {format(new Date(s.day), "dd/MM")}
            </text>
          );
        })}

        {hover != null && series[hover] && (
          <g>
            <line x1={x(hover)} y1={PAD_T} x2={x(hover)} y2={PAD_T + innerH} stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(series[hover].visits)} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(series[hover].unique_visitors)} r="3" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--background))" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      {hover != null && series[hover] && (
        <div
          className="absolute pointer-events-none bg-background border border-border rounded-lg p-2 text-[11px] shadow-lg"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: 4,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-bold mb-1">{format(new Date(series[hover].day), "d 'de' MMM, yyyy", { locale: ptBR })}</p>
          <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> {series[hover].visits} visitas</p>
          <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> {series[hover].unique_visitors} únicos</p>
        </div>
      )}
    </div>
  );
}

function Bar({ value, max, color = "primary" }: { value: number; max: number; color?: string }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden w-full">
      <div className={`h-full bg-${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsTab() {
  const [range, setRange] = useState<Range>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickFlag, setTickFlag] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get<AnalyticsData>(`/admin/analytics?range=${range}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    const es = new EventSource("/api/admin/events", { withCredentials: true } as any);
    const handler = () => setTickFlag((f) => f + 1);
    es.addEventListener("visit", handler);
    return () => es.close();
  }, []);

  useEffect(() => {
    if (tickFlag === 0) return;
    api.get<AnalyticsData>(`/admin/analytics?range=${range}`).then(setData).catch(() => {});
  }, [tickFlag, range]);

  const trend = useMemo(() => {
    if (!data || data.series.length < 4) return null;
    const half = Math.floor(data.series.length / 2);
    const prev = data.series.slice(0, half).reduce((s, d) => s + d.visits, 0);
    const cur = data.series.slice(half).reduce((s, d) => s + d.visits, 0);
    if (!prev) return null;
    return ((cur - prev) / prev) * 100;
  }, [data]);

  if (loading || !data) return <div className="py-16 text-center text-muted-foreground">Carregando analytics...</div>;

  const t = data.totals;
  const maxCountry = Math.max(...data.countries.map((c) => c.visits), 1);
  const maxPage = Math.max(...data.topPages.map((p) => p.visits), 1);
  const maxRef = Math.max(...data.referrers.map((r) => r.visits), 1);
  const totalDevices = data.devices.reduce((s, d) => s + d.visits, 0) || 1;
  const totalBrowsers = data.browsers.reduce((s, b) => s + b.visits, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {t.live} ao vivo
          </div>
          <span className="text-xs text-muted-foreground">últimos 15 min</span>
        </div>
        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          {(["7d", "30d", "90d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setRange(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                range === p ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "7d" ? "7 DIAS" : p === "30d" ? "30 DIAS" : p === "90d" ? "90 DIAS" : "TUDO"}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Eye size={18} />} label="Visitas" value={t.rangeVisits.toLocaleString("pt-BR")} trend={trend ?? undefined} sub={`${t.totalVisits.toLocaleString("pt-BR")} no total`} />
        <StatCard icon={<Users size={18} />} label="Únicos" value={t.rangeUniqueVisitors.toLocaleString("pt-BR")} sub={`${t.totalUniqueVisitors.toLocaleString("pt-BR")} no total`} />
        <StatCard icon={<Radio size={18} />} label="Hoje" value={t.todayVisits.toLocaleString("pt-BR")} sub={`${t.todayUniqueVisitors} únicos`} />
        <StatCard icon={<Globe size={18} />} label="Países" value={data.countries.length} sub={`${data.cities.length} cidades`} />
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold">Tráfego ao longo do tempo</h3>
            <p className="text-xs text-muted-foreground">Passe o mouse para ver os detalhes</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary" /> Visitas</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-muted-foreground" style={{ borderTop: "1px dashed currentColor" }} /> Únicos</span>
          </div>
        </div>
        <LineChart series={data.series} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
            <FileText size={16} className="text-primary" /> Páginas mais visitadas
          </h3>
          <div className="space-y-3">
            {data.topPages.length === 0 && <p className="text-sm text-muted-foreground">Sem dados</p>}
            {data.topPages.map((p) => (
              <div key={p.page}>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <a href={p.page} target="_blank" rel="noreferrer" className="text-sm font-mono truncate hover:text-primary inline-flex items-center gap-1">
                    {p.page} <ExternalLink size={10} className="opacity-50" />
                  </a>
                  <span className="text-xs font-bold tabular-nums whitespace-nowrap">
                    {p.visits.toLocaleString("pt-BR")}
                    <span className="text-muted-foreground font-normal"> · {p.unique_visitors} únicos</span>
                  </span>
                </div>
                <Bar value={p.visits} max={maxPage} />
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
            <Globe size={16} className="text-primary" /> Países
          </h3>
          <div className="space-y-3">
            {data.countries.length === 0 && <p className="text-sm text-muted-foreground">Sem dados</p>}
            {data.countries.map((c) => (
              <div key={c.country}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2">
                    <span className="text-base">{flagEmoji(c.countryCode)}</span> {c.country}
                  </span>
                  <span className="text-xs font-bold tabular-nums">
                    {c.visits.toLocaleString("pt-BR")}
                    <span className="text-muted-foreground font-normal"> · {c.unique_visitors}</span>
                  </span>
                </div>
                <Bar value={c.visits} max={maxCountry} />
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-bold mb-4">Dispositivos</h3>
          <div className="space-y-2">
            {data.devices.map((d) => {
              const pct = (d.visits / totalDevices) * 100;
              return (
                <div key={d.device} className="flex items-center gap-3">
                  <div className="text-muted-foreground"><DeviceIcon d={d.device} /></div>
                  <span className="text-sm capitalize w-20">{d.device === "unknown" ? "outro" : d.device}</span>
                  <div className="flex-1"><Bar value={d.visits} max={totalDevices} /></div>
                  <span className="text-xs font-bold tabular-nums w-14 text-right">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading font-bold mb-4">Navegadores</h3>
          <div className="space-y-2">
            {data.browsers.map((b) => {
              const pct = (b.visits / totalBrowsers) * 100;
              return (
                <div key={b.browser} className="flex items-center gap-3">
                  <span className="text-sm w-20 capitalize">{b.browser}</span>
                  <div className="flex-1"><Bar value={b.visits} max={totalBrowsers} /></div>
                  <span className="text-xs font-bold tabular-nums w-14 text-right">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referrers (sources) */}
        <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-heading font-bold mb-1">De onde vem o tráfego</h3>
          <p className="text-xs text-muted-foreground mb-4">Instagram, TikTok, busca, links diretos…</p>
          {data.referrers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem dados ainda</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {data.referrers.map((r) => {
                const pct = (r.visits / maxRef) * 100;
                return (
                  <div key={r.source} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${sourceColor(r.source)}`}>
                      <SourceIcon source={r.source} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-sm font-medium truncate">{r.source}</span>
                        <span className="text-xs font-bold tabular-nums whitespace-nowrap">{r.visits.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* World map */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="font-heading font-bold flex items-center gap-2">
              <Globe size={16} className="text-primary" /> Mapa de visitantes
            </h3>
            <p className="text-xs text-muted-foreground">Heatmap dos acessos por localização</p>
          </div>
          <span className="text-xs text-muted-foreground">{data.mapPoints.length} pontos</span>
        </div>
        <VisitorsMap points={data.mapPoints} live={data.liveVisitors} />
      </div>

      {/* Live visitors */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            Online agora
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
            {data.liveVisitors.length} {data.liveVisitors.length === 1 ? "pessoa" : "pessoas"}
          </span>
        </div>
        {data.liveVisitors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Ninguém no site neste momento</p>
        ) : (
          <div className="space-y-1.5">
            {data.liveVisitors.map((v) => (
              <div key={v.sessionId} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-secondary/40 text-sm">
                <span className="text-lg leading-none">{flagEmoji(v.countryCode)}</span>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${sourceColor(v.source)}`}>
                  <SourceIcon source={v.source} size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                    <span className="truncate">{[v.city, v.country].filter(Boolean).join(", ") || "Local desconhecido"}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="truncate">{v.source}</span>
                  </div>
                  <code className="font-mono text-xs truncate block">{v.page}</code>
                </div>
                <span className="text-muted-foreground"><DeviceIcon d={v.device || "desktop"} /></span>
                <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                  {formatDistanceToNow(new Date(v.createdAt), { locale: ptBR, addSuffix: false })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Atividade recente
        </h3>
        <div className="space-y-1.5">
          {data.recent.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma visita ainda</p>}
          {data.recent.map((v) => (
            <div key={v.id} className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-secondary/40 text-sm">
              <span className="text-base">{flagEmoji(v.countryCode)}</span>
              <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${sourceColor(v.source)}`}>
                <SourceIcon source={v.source} size={11} />
              </span>
              <span className="text-muted-foreground"><DeviceIcon d={v.device || "desktop"} /></span>
              <code className="font-mono text-xs flex-1 truncate">{v.page}</code>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {[v.city, v.country].filter(Boolean).join(", ") || "—"}
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums w-20 text-right">
                {formatDistanceToNow(new Date(v.createdAt), { locale: ptBR, addSuffix: false })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
