import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Globe, Users, Eye } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import AnalyticsGlobe from "./AnalyticsGlobe";

interface Visit {
  id: string;
  page: string;
  country: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

interface GlobePoint {
  lat: number;
  lng: number;
  country: string;
  city: string | null;
  count: number;
}

export default function AnalyticsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    fetchVisits();
    // Realtime subscription
    const channel = supabase
      .channel("page_visits_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_visits" }, (payload) => {
        setVisits((prev) => [payload.new as Visit, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchVisits = async () => {
    const { data } = await supabase
      .from("page_visits")
      .select("id, page, country, city, lat, lng, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (data) setVisits(data as Visit[]);
    setLoading(false);
  };

  const filteredVisits = visits.filter((v) => {
    if (period === "all") return true;
    const days = period === "7d" ? 7 : 30;
    return new Date(v.created_at) > subDays(new Date(), days);
  });

  // Aggregate globe points
  const globePoints: GlobePoint[] = [];
  const pointMap = new Map<string, GlobePoint>();
  filteredVisits.forEach((v) => {
    if (v.lat != null && v.lng != null && v.country) {
      const key = `${v.lat.toFixed(1)}_${v.lng.toFixed(1)}`;
      const existing = pointMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        const p = { lat: v.lat, lng: v.lng, country: v.country, city: v.city, count: 1 };
        pointMap.set(key, p);
        globePoints.push(p);
      }
    }
  });

  // Stats
  const totalVisits = filteredVisits.length;
  const uniqueCountries = new Set(filteredVisits.map((v) => v.country).filter(Boolean)).size;
  const topPages = Object.entries(
    filteredVisits.reduce<Record<string, number>>((acc, v) => {
      acc[v.page] = (acc[v.page] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topCountries = Object.entries(
    filteredVisits.reduce<Record<string, number>>((acc, v) => {
      if (v.country) acc[v.country] = (acc[v.country] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Daily visits for chart-like display
  const dailyVisits = Object.entries(
    filteredVisits.reduce<Record<string, number>>((acc, v) => {
      const day = format(new Date(v.created_at), "dd/MM");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {})
  ).slice(0, 14).reverse();

  const maxDaily = Math.max(...dailyVisits.map(([, c]) => c), 1);

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Carregando analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="flex gap-2">
        {(["7d", "30d", "all"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "Todos"}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Eye size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Visitas</span>
          </div>
          <p className="font-heading text-2xl font-bold">{totalVisits}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Globe size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Países</span>
          </div>
          <p className="font-heading text-2xl font-bold">{uniqueCountries}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Hoje</span>
          </div>
          <p className="font-heading text-2xl font-bold">
            {filteredVisits.filter((v) => new Date(v.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 size={16} /> <span className="text-xs font-medium uppercase tracking-wider">Pág. top</span>
          </div>
          <p className="font-heading text-lg font-bold truncate">{topPages[0]?.[0] || "-"}</p>
        </div>
      </div>

      {/* Globe */}
      <div>
        <h3 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
          <Globe size={18} className="text-primary" /> Acessos em tempo real
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </h3>
        <AnalyticsGlobe points={globePoints} />
      </div>

      {/* Charts area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily visits bar chart */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-heading text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Visitas por dia</h4>
          <div className="flex items-end gap-1 h-32">
            {dailyVisits.map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary rounded-t transition-all"
                  style={{ height: `${(count / maxDaily) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[9px] text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-heading text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Top países</h4>
          <div className="space-y-2">
            {topCountries.map(([country, count]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-sm">{country}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(count / (topCountries[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {topCountries.length === 0 && <p className="text-sm text-muted-foreground">Nenhum dado ainda</p>}
          </div>
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="font-heading text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Páginas mais visitadas</h4>
        <div className="space-y-2">
          {topPages.map(([page, count]) => (
            <div key={page} className="flex items-center justify-between">
              <span className="text-sm font-mono">{page}</span>
              <span className="text-sm font-bold">{count}</span>
            </div>
          ))}
          {topPages.length === 0 && <p className="text-sm text-muted-foreground">Nenhum dado ainda</p>}
        </div>
      </div>
    </div>
  );
}
