import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";
import { useTrackVisit } from "@/hooks/use-track-visit";
import PagePixels from "./components/PagePixels";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import PageGuard from "./components/PageGuard";
import Index from "./pages/Index";
import Livro from "./pages/Livro";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import Consultoria from "./pages/Consultoria";
import Curso from "./pages/Curso";
import OlivarGlobal from "./pages/OlivarGlobal";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Servicos from "./pages/Servicos";
import Conteudo from "./pages/Conteudo";
import Sobre from "./pages/Sobre";
import OlsProject from "./pages/OlsProject";
import Projetos from "./pages/Projetos";
import VytalLP from "./pages/VytalLP";
import CasaDos20LP from "./pages/CasaDos20LP";


const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PostEditor = lazy(() => import("./pages/PostEditor"));
const AdminLiveWall = lazy(() => import("./pages/AdminLiveWall"));

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isStandaloneLp = location.pathname === "/vytal" || location.pathname === "/casados20";
  useTrackVisit();
  return (
    <>
      <ScrollToTop />
      <PagePixels />
      {!isAdmin && !isStandaloneLp && <Navbar />}
      <div style={!isAdmin && !isStandaloneLp ? { paddingTop: 'env(safe-area-inset-top, 0px)' } : undefined}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/livro" element={<PageGuard><Livro /></PageGuard>} />
        <Route path="/blog" element={<PageGuard><Blog /></PageGuard>} />
        <Route path="/blog/:slug" element={<PageGuard><BlogPost /></PageGuard>} />
        <Route path="/contato" element={<PageGuard><Contato /></PageGuard>} />
        <Route path="/consultoria" element={<PageGuard><Consultoria /></PageGuard>} />
        <Route path="/curso" element={<PageGuard><Curso /></PageGuard>} />
        <Route path="/olivar-global" element={<PageGuard><OlivarGlobal /></PageGuard>} />
        <Route path="/servicos" element={<PageGuard><Servicos /></PageGuard>} />
        <Route path="/conteudo" element={<PageGuard><Conteudo /></PageGuard>} />
        <Route path="/sobre" element={<PageGuard><Sobre /></PageGuard>} />
        <Route path="/olsproject" element={<PageGuard><OlsProject /></PageGuard>} />
        <Route path="/ols-project" element={<PageGuard><OlsProject /></PageGuard>} />
        <Route path="/projetos" element={<PageGuard><Projetos /></PageGuard>} />
        <Route path="/vytal" element={<PageGuard><VytalLP /></PageGuard>} />
        <Route path="/casados20" element={<PageGuard><CasaDos20LP /></PageGuard>} />
        <Route path="/criar-app" element={<PageGuard><Projetos /></PageGuard>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><AdminDashboard /></Suspense>} />
        <Route path="/admin/live" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><AdminLiveWall /></Suspense>} />
        <Route path="/admin/post/new" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><PostEditor /></Suspense>} />
        <Route path="/admin/post/:id" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><PostEditor /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && !isStandaloneLp && <Footer />}
      </div>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
