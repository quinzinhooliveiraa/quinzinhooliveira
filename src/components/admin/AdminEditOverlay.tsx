import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";

interface AdminEditOverlayProps {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  type?: "text" | "textarea" | "url";
  children: React.ReactNode;
}

export function AdminEditOverlay({ value, onSave, label = "Editar", type = "url", children }: AdminEditOverlayProps) {
  const { isAdmin } = useAdminStatus();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative group/admin">
      {children}

      {/* Edit button */}
      {!editing && (
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="absolute top-2 right-2 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg opacity-0 group-hover/admin:opacity-100 transition-opacity shadow-lg"
        >
          <Pencil size={12} /> {label}
        </button>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-3">
            <label className="text-sm font-bold text-foreground">{label}</label>
            {type === "textarea" ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full p-3 bg-card border border-border rounded-lg text-sm text-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <input
                type={type}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full p-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { onSave(draft); setEditing(false); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg"
              >
                <Check size={12} /> Salvar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-card border border-border text-foreground text-xs font-bold rounded-lg"
              >
                <X size={12} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
