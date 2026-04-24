import { useMemo, useState } from "react";

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

const W = 1000;
const H = 500;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return { x, y };
}

const CONTINENTS_PATHS: string[] = [
  "M157,118 L185,108 L218,112 L246,106 L268,118 L283,138 L298,160 L286,182 L268,196 L256,218 L234,232 L208,228 L186,212 L168,196 L150,178 L142,156 L148,134 Z",
  "M308,108 L348,98 L390,102 L432,108 L468,112 L502,118 L532,128 L562,140 L588,156 L606,172 L598,194 L582,212 L568,228 L546,238 L518,242 L488,238 L458,230 L432,220 L408,206 L388,188 L368,168 L348,148 L328,128 Z",
  "M482,236 L508,232 L536,240 L562,256 L578,278 L582,302 L572,326 L552,346 L528,358 L502,362 L476,358 L452,346 L432,328 L420,308 L416,286 L426,264 L448,248 Z",
  "M608,128 L646,118 L686,114 L722,116 L758,124 L788,138 L808,158 L818,182 L812,206 L796,228 L772,242 L744,248 L716,242 L688,232 L660,220 L632,206 L612,188 L598,170 L596,148 Z",
  "M756,288 L788,282 L818,288 L840,302 L848,322 L838,342 L818,358 L792,366 L766,362 L748,348 L740,328 L744,308 Z",
  "M198,328 L242,318 L286,322 L324,332 L356,348 L370,372 L368,396 L352,418 L326,432 L296,438 L266,436 L238,428 L214,414 L196,394 L188,372 L188,350 Z",
];

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
  const [hover, setHover] = useState<{ p: MapPoint; x: number; y: number } | null>(null);
  const buckets = useMemo(() => bucketize(points), [points]);
  const max = useMemo(() => Math.max(...buckets.map((p) => p.visits), 1), [buckets]);

  const livePoints = useMemo(
    () => (live || []).filter((v): v is LiveVisitor & { lat: number; lng: number } => v.lat != null && v.lng != null),
    [live]
  );

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[hsl(220,30%,7%)] border border-border">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        <defs>
          <radialGradient id="heatdot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="livedot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(220,20%,15%)" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#grid)" />

        {/* Continents (stylized blobs) */}
        <g fill="hsl(220,15%,18%)" stroke="hsl(220,15%,28%)" strokeWidth="0.6">
          {CONTINENTS_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Equator + prime meridian */}
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="hsl(220,20%,22%)" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="hsl(220,20%,22%)" strokeWidth="0.5" strokeDasharray="3 5" />

        {/* Heatmap dots */}
        {buckets.map((p, i) => {
          const { x, y } = project(p.lat, p.lng);
          const intensity = p.visits / max;
          const r = 6 + intensity * 22;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="url(#heatdot)" />
              <circle
                cx={x}
                cy={y}
                r={Math.max(2, 2 + intensity * 3)}
                fill="hsl(var(--primary))"
                onMouseEnter={() => setHover({ p, x, y })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}

        {/* Live visitors pulse */}
        {livePoints.map((v, i) => {
          const { x, y } = project(v.lat, v.lng);
          return (
            <g key={`live-${i}`}>
              <circle cx={x} cy={y} r={14} fill="url(#livedot)">
                <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={3} fill="#22c55e" stroke="hsl(220,30%,7%)" strokeWidth="1" />
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="absolute pointer-events-none bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-xs shadow-xl"
          style={{
            left: `${(hover.x / W) * 100}%`,
            top: `${(hover.y / H) * 100}%`,
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
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
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
