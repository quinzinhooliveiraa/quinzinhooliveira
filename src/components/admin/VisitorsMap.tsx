import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Plus, Minus, RotateCcw, Maximize2 } from "lucide-react";

interface MapPoint {
  lat: number;
  lng: number;
  country: string | null;
  countryCode: string | null;
  region?: string | null;
  city: string | null;
  visits: number;
  unique_visitors: number;
}

interface LiveVisitor {
  lat: number | null;
  lng: number | null;
  city: string | null;
  region?: string | null;
  country: string | null;
}

interface Props {
  points: MapPoint[];
  live?: LiveVisitor[];
  height?: number;
  /** When true, removes the inner border (used for fullscreen wall) */
  bare?: boolean;
}

const GEO_URL = "/world-110m.json";
const W = 1000;
const H = 500;

// Bucket size shrinks as you zoom in, so dots become more granular
function bucketize(points: MapPoint[], zoom: number) {
  if (points.length === 0) return points;
  // At zoom 1 → 4° cells, at zoom 8 → 0.5° cells, at zoom 16 → ~0.05°
  const cellSize = Math.max(0.05, 4 / zoom);
  const buckets = new Map<string, MapPoint>();
  for (const p of points) {
    const lat = Math.round(p.lat / cellSize) * cellSize;
    const lng = Math.round(p.lng / cellSize) * cellSize;
    const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
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

interface ViewState {
  coordinates: [number, number];
  zoom: number;
}

const INITIAL_VIEW: ViewState = { coordinates: [0, 20], zoom: 1 };

export default function VisitorsMap({ points, live = [], height, bare = false }: Props) {
  const [hover, setHover] = useState<{ p: MapPoint; xPct: number; yPct: number } | null>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);

  const buckets = useMemo(() => bucketize(points, view.zoom), [points, view.zoom]);
  const max = useMemo(() => Math.max(...buckets.map((p) => p.visits), 1), [buckets]);

  const livePoints = useMemo(
    () => (live || []).filter((v): v is LiveVisitor & { lat: number; lng: number } => v.lat != null && v.lng != null),
    [live]
  );

  const setZoom = (z: number) => setView((v) => ({ ...v, zoom: Math.max(1, Math.min(48, z)) }));

  const focusPoint = (p: MapPoint) => {
    setView({ coordinates: [p.lng, p.lat], zoom: Math.min(48, Math.max(view.zoom * 2, 8)) });
  };

  // dot/halo shrink with zoom so it doesn't cover the city
  const dotScale = 1 / Math.sqrt(view.zoom);

  return (
    <div
      className={`relative w-full overflow-hidden ${bare ? "" : "rounded-xl bg-[hsl(220,30%,7%)] border border-border"}`}
      style={height ? { height } : undefined}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        width={W}
        height={H}
        style={{
          width: "100%",
          height: height ? "100%" : "auto",
          display: "block",
          background: bare ? "hsl(220,30%,7%)" : undefined,
        }}
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

        <ZoomableGroup
          zoom={view.zoom}
          center={view.coordinates}
          minZoom={1}
          maxZoom={48}
          onMoveEnd={(pos: any) => setView({ coordinates: pos.coordinates, zoom: pos.zoom })}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(220,15%,18%)"
                  stroke="hsl(220,15%,28%)"
                  strokeWidth={0.4 / Math.sqrt(view.zoom)}
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
            const r = (5 + intensity * 18) * dotScale;
            const dotR = Math.max(1.5, (2 + intensity * 3) * dotScale);
            return (
              <Marker key={`pt-${i}`} coordinates={[p.lng, p.lat]}>
                <circle r={r} fill="url(#vm-heatdot)" pointerEvents="none" />
                <circle
                  r={dotR}
                  fill="hsl(var(--primary))"
                  style={{ cursor: "pointer" }}
                  onClick={() => focusPoint(p)}
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

          {livePoints.map((v, i) => {
            const r = 14 * dotScale;
            const dotR = 3 * dotScale;
            return (
              <Marker key={`live-${i}`} coordinates={[v.lng, v.lat]}>
                <circle r={r} fill="url(#vm-livedot)" pointerEvents="none">
                  <animate
                    attributeName="r"
                    values={`${6 * dotScale};${18 * dotScale};${6 * dotScale}`}
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r={dotR} fill="#22c55e" stroke="hsl(220,30%,7%)" strokeWidth={1 * dotScale} />
              </Marker>
            );
          })}
        </ZoomableGroup>
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
          <p className="font-bold">
            {[hover.p.city, hover.p.region, hover.p.country].filter(Boolean).join(", ") || "—"}
          </p>
          <p className="text-muted-foreground">
            {hover.p.visits.toLocaleString("pt-BR")} visitas · {hover.p.unique_visitors} únicos
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">clique pra dar zoom</p>
        </div>
      )}

      {buckets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
          Sem dados de localização ainda
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 bg-background/80 backdrop-blur rounded-lg border border-border p-1 z-20">
        <button
          onClick={() => setZoom(view.zoom * 2)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          title="Aproximar"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => setZoom(view.zoom / 2)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          title="Afastar"
        >
          <Minus size={14} />
        </button>
        <div className="border-t border-border my-0.5" />
        <button
          onClick={() => setView(INITIAL_VIEW)}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          title="Vista mundial"
        >
          <RotateCcw size={13} />
        </button>
        <button
          onClick={() => setView({ coordinates: [-50, -15], zoom: 4 })}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors text-[9px] font-bold"
          title="Brasil"
        >
          BR
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-3 right-3 text-[10px] text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-md border border-border z-20 font-mono">
        {view.zoom.toFixed(1)}×
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[10px] text-muted-foreground bg-background/60 backdrop-blur px-2.5 py-1.5 rounded-md border border-border z-20">
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

      {!bare && (
        <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/60 bg-background/40 backdrop-blur px-2 py-1 rounded-md border border-border/50 z-20 max-w-[55%]">
          <Maximize2 size={9} className="inline mr-1" />
          arraste pra mover, role pra zoom — clique nos pontos pra aproximar
        </div>
      )}
    </div>
  );
}
