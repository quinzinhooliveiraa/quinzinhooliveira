import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAdmin } from "@/hooks/use-admin";
import { Loader2 } from "lucide-react";
import VisitorsMap from "@/components/admin/VisitorsMap";
import { ArrowLeft, Activity, Globe2, Users, Eye } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MapPoint {
  lat: number;
  lng: number;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  visits: number;
  unique_visitors: number;
}

interface LiveVisitor {
  sessionId: string;
  page: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  source: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
}

interface AnalyticsResponse {
  mapPoints: MapPoint[];
  liveVisitors: LiveVisitor[];
  totals: { live?: number; todayVisits?: number; todayUniqueVisitors?: number };
}

export default function AdminLiveWall() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const load = () => {
      api
        .get<AnalyticsResponse>("/admin/analytics?range=24h")
        .then((r) => {
          if (!cancelled) setData(r);
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isAdmin]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const liveCount = data?.liveVisitors?.length ?? 0;
  const todayVisits = data?.totals?.todayVisits ?? 0;
  const todayUnique = data?.totals?.todayUniqueVisitors ?? 0;

  const sortedLive = useMemo(
    () => [...(data?.liveVisitors || [])].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [data?.liveVisitors]
  );

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[hsl(220,30%,5%)] flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 size={16} className="animate-spin" /> Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,30%,5%)] text-foreground flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-background/40 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> voltar
          </button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Globe2 size={18} className="text-primary" />
            <h1 className="font-heading font-bold text-lg">Live Wall</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              · visitantes em tempo real
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <Stat
            icon={<Activity size={14} className="text-green-500" />}
            label="online agora"
            value={liveCount}
            highlight
          />
          <Stat icon={<Eye size={14} />} label="visitas hoje" value={todayVisits} />
          <Stat icon={<Users size={14} />} label="únicos hoje" value={todayUnique} />
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 grid lg:grid-cols-[1fr_360px] gap-0 min-h-0">
        {/* Map */}
        <div className="relative min-h-[60vh] lg:min-h-0">
          <VisitorsMap points={data?.mapPoints || []} live={data?.liveVisitors || []} bare height={undefined} />
        </div>

        {/* Live feed */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border bg-background/30 flex flex-col max-h-[40vh] lg:max-h-none">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <h2 className="font-heading font-bold text-sm">Online agora</h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{liveCount}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedLive.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Nenhum visitante online nos últimos 5 minutos.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {sortedLive.map((v) => {
                  const seconds = Math.max(0, Math.round((now - +new Date(v.createdAt)) / 1000));
                  const ago = seconds < 60 ? `${seconds}s` : formatDistanceToNowStrict(new Date(v.createdAt), { locale: ptBR });
                  const place = [v.city, v.region, v.country].filter(Boolean).join(", ") || "—";
                  return (
                    <li key={v.sessionId} className="p-3 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{place}</p>
                          <p className="text-[11px] text-muted-foreground truncate font-mono">{v.page}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {v.source && v.source !== "Direto" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                {v.source}
                              </span>
                            )}
                            {v.device && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                {v.device}
                              </span>
                            )}
                            {v.browser && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                {v.browser}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-green-500 font-mono whitespace-nowrap">{ago}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-border text-[10px] text-muted-foreground text-center">
            atualiza a cada 8s · {format(now, "HH:mm:ss")}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="leading-tight">
        <p className={`text-base sm:text-lg font-bold tabular-nums ${highlight ? "text-green-500" : ""}`}>{value}</p>
        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
