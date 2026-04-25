import { Navigate, useLocation, Link } from "react-router-dom";
import { EyeOff } from "lucide-react";
import { useHiddenPages } from "@/hooks/use-page-visibility";
import { useAdminStatus } from "@/hooks/use-admin-status";

export default function PageGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { hidden, loading } = useHiddenPages();
  const { isAdmin, loading: adminLoading } = useAdminStatus();

  if (loading || adminLoading) return null;

  const isHidden = hidden.includes(location.pathname);

  if (!isAdmin && isHidden) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isAdmin && isHidden && (
        <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-amber-500/95 text-amber-950 backdrop-blur shadow-md">
          <div className="section-container py-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <EyeOff size={14} className="shrink-0" />
              <span className="truncate">
                <strong>Página oculta:</strong> só você (admin) consegue ver. Visitantes são redirecionados pra Início.
              </span>
            </div>
            <Link
              to="/admin"
              className="shrink-0 underline font-semibold whitespace-nowrap hover:no-underline"
            >
              gerenciar
            </Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
