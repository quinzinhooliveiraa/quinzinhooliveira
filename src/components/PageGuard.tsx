import { Navigate, useLocation } from "react-router-dom";
import { useHiddenPages } from "@/hooks/use-page-visibility";
import { useAdminStatus } from "@/hooks/use-admin-status";

export default function PageGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { hidden, loading } = useHiddenPages();
  const { isAdmin, loading: adminLoading } = useAdminStatus();

  if (loading || adminLoading) return null;
  if (!isAdmin && hidden.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
