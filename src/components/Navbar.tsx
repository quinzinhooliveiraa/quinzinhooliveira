import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useHiddenPages } from "@/hooks/use-page-visibility";

const navItems = [
  { label: "INÍCIO", path: "/" },
  { label: "SOBRE", path: "/sobre" },
  { label: "BLOG", path: "/blog" },
  { label: "CONTATO", path: "/contato" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdminStatus();
  const { hidden } = useHiddenPages();

  const visibleNavItems = navItems.filter((item) => isAdmin || !hidden.includes(item.path));
  const allItems = isAdmin
    ? [...visibleNavItems, { label: "PAINEL", path: "/admin" }]
    : visibleNavItems;
  const contactHidden = !isAdmin && hidden.includes("/contato");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'hsla(0, 0%, 7%, 0.9)', borderColor: 'hsl(0, 0%, 18%)', color: 'hsl(0, 0%, 95%)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="section-container flex items-center justify-between h-14 sm:h-16">
        <Link to="/" className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[hsl(0,0%,95%)]">
          QUINZINHO<span className="text-primary">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {allItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                location.pathname === item.path || (item.path === "/admin" && location.pathname.startsWith("/admin"))
                  ? "text-primary font-semibold"
                  : "text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,95%)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,95%)] transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {location.pathname === "/consultoria" ? (
            <a
              href="#formulario"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full transition-all hover:bg-primary/90 animate-pulse hover:animate-none"
            >
              AGENDAR ANÁLISE
            </a>
          ) : !contactHidden ? (
            <Link
              to="/contato"
              className="px-5 py-2 text-sm font-medium border border-primary text-primary rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              CONTATO
            </Link>
          ) : null}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,95%)] transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="text-[hsl(0,0%,95%)] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t overflow-hidden"
            style={{ backgroundColor: 'hsl(0, 0%, 7%)', borderColor: 'hsl(0, 0%, 18%)' }}
          >
            <div className="px-4 py-6 space-y-4">
              {allItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium uppercase tracking-wider text-base ${location.pathname === item.path ? "text-primary font-semibold" : "text-[hsl(0,0%,55%)] hover:text-[hsl(0,0%,95%)]"}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {!contactHidden && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link
                    to="/contato"
                    onClick={() => setMobileOpen(false)}
                    className="block mt-2 px-5 py-3 text-sm font-medium border border-primary text-primary rounded-full transition-colors hover:bg-primary hover:text-primary-foreground text-center"
                  >
                    CONTATO
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
