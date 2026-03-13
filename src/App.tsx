import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from "react-helmet-async";
import { useTrackVisit } from "@/hooks/use-track-visit";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
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

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PostEditor = lazy(() => import("./pages/PostEditor"));

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  useTrackVisit();

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/livro" element={<Livro />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/consultoria" element={<Consultoria />} />
        <Route path="/curso" element={<Curso />} />
        <Route path="/olivar-global" element={<OlivarGlobal />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/conteudo" element={<Conteudo />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/olsproject" element={<OlsProject />} />
        <Route path="/ols-project" element={<OlsProject />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><AdminDashboard /></Suspense>} />
        <Route path="/admin/post/new" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><PostEditor /></Suspense>} />
        <Route path="/admin/post/:id" element={<Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><p>Carregando...</p></div>}><PostEditor /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
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
