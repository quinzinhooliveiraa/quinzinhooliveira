import { Navigate, useLocation } from "react-router-dom";
import { useHiddenPages } from "@/hooks/use-page-visibility";

export default function PageGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { hidden, loading } = useHiddenPages();

  if (loading) return null;
  if (hidden.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
