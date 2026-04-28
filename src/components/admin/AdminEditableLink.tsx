import { useState } from "react";
import { Link } from "react-router-dom";
import { LinkIcon, Check, X } from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useSiteSetting } from "@/hooks/use-site-settings";

interface AdminEditableLinkProps {
  /** Key in site_settings to persist the URL */
  settingKey: string;
  /** Default/fallback URL */
  defaultHref: string;
  /** Content inside the link */
  children: React.ReactNode;
  /** Extra classes for the link */
  className?: string;
  /** Inline styles (preserved on the rendered link) */
  style?: React.CSSProperties;
  /** Whether the link is external (opens in new tab) */
  external?: boolean;
  /** onClick override (e.g. for scroll-to) */
  onClick?: (e: React.MouseEvent) => void;
}

export function AdminEditableLink({
  settingKey,
  defaultHref,
  children,
  className = "",
  style,
  external,
  onClick,
}: AdminEditableLinkProps) {
  const { isAdmin } = useAdminStatus();
  const { value: href, update } = useSiteSetting(settingKey, defaultHref);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(href);

  const isExternal = external ?? href.startsWith("http");

  const linkEl = isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <Link to={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );

  if (!isAdmin) return linkEl;

  return (
    <div className="relative group/admin-link inline-block">
      {linkEl}

      {!editing && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDraft(href);
            setEditing(true);
          }}
          className="absolute -top-2 -right-2 z-50 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md opacity-0 group-hover/admin-link:opacity-100 transition-opacity shadow-lg"
        >
          <LinkIcon size={10} /> Link
        </button>
      )}

      {editing && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl p-3 min-w-[300px]">
          <label className="text-xs font-bold text-foreground block mb-1">URL do botão</label>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://... ou /pagina"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") { update(draft); setEditing(false); }
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { update(draft); setEditing(false); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-md"
            >
              <Check size={10} /> Salvar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 px-3 py-1.5 bg-background border border-border text-foreground text-[10px] font-bold rounded-md"
            >
              <X size={10} /> Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
