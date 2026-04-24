import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

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
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
}

interface Props {
  points: MapPoint[];
  live?: LiveVisitor[];
}

const GEO_URL = "/world-110m.json";

function bucketize(points: MapPoint[]) {
  if (points.length === 0) return points;
  const cellSize = 4;
  const buckets = new Map<string, MapPoint>();
  for (const p of points) {
    const lat = Math.round(p.lat / cellSize) * cellSize;
    const lng = Math.round(p.lng / cellSize) * cellSize;
    const key = `${lat}_${lng}`;
    const ex = buckets.get(key);
    if (ex) {
      ex.visits += p.visits;
      ex.unique_visitors += p.unique_visitors;
    } else {
      buckets.set(key, { ...p, lat, lng });
    }
  }
  return Array.from(buckets.values());
}

export default function VisitorsMap({ points, live = [] }: Props) {
  const [hover, setHover] = useState<{ p: MapPoint; xPct: number; yPct: number } | null>(null);
  const buckets = useMemo(() => bucketize(points), [points]);
  const max = useMemo(() => Math.max(...buckets.map((p) => p.visits), 1), [buckets]);

  const livePoints = useMemo(
    () => (live || []).filter((v): v is LiveVisitor & { lat: number; lng: number } => v.lat != null && v.lng != null),
    [live]
  );

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[hsl(220,30%,7%)] border border-border">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        width={1000}
        height={500}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <radialGradient id="vm-heatdot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vm-livedot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(220,15%,18%)"
                stroke="hsl(220,15%,26%)"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "hsl(220,15%,22%)" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {buckets.map((p, i) => {
          const intensity = p.visits / max;
          const r = 5 + intensity * 18;
          return (
            <Marker key={`pt-${i}`} coordinates={[p.lng, p.lat]}>
              <circle r={r} fill="url(#vm-heatdot)" />
              <circle
                r={Math.max(2, 2 + intensity * 3)}
                fill="hsl(var(--primary))"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement) || null;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const cr = e.currentTarget.getBoundingClientRect();
                  setHover({
                    p,
                    xPct: ((cr.left + cr.width / 2 - rect.left) / rect.width) * 100,
                    yPct: ((cr.top + cr.height / 2 - rect.top) / rect.height) * 100,
                  });
                }}
                onMouseLeave={() => setHover(null)}
              />
            </Marker>
          );
        })}

        {livePoints.map((v, i) => (
          <Marker key={`live-${i}`} coordinates={[v.lng, v.lat]}>
            <circle r={14} fill="url(#vm-livedot)">
              <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r={3} fill="#22c55e" stroke="hsl(220,30%,7%)" strokeWidth={1} />
          </Marker>
        ))}
      </ComposableMap>

      {hover && (
        <div
          className="absolute pointer-events-none bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-xs shadow-xl z-10"
          style={{
            left: `${hover.xPct}%`,
            top: `${hover.yPct}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-bold">{[hover.p.city, hover.p.country].filter(Boolean).join(", ") || "—"}</p>
          <p className="text-muted-foreground">
            {hover.p.visits.toLocaleString("pt-BR")} visitas · {hover.p.unique_visitors} únicos
          </p>
        </div>
      )}

      {buckets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
          Sem dados de localização ainda
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[10px] text-muted-foreground bg-background/60 backdrop-blur px-2.5 py-1.5 rounded-md border border-border">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" /> visitas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          ao vivo
        </span>
      </div>
    </div>
  );
}
