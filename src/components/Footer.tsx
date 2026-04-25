import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Mail } from "lucide-react";
import { useHiddenPages } from "@/hooks/use-page-visibility";
import { useAdminStatus } from "@/hooks/use-admin-status";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/quinzinhooliveiraa_/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@quinzinhooliveira", label: "YouTube" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/joaquim-emmanuel-oliveira/", label: "LinkedIn" },
  { icon: Mail, href: "/contato", label: "Email" },
];

const Footer = () => {
  const { hidden } = useHiddenPages();
  const { isAdmin } = useAdminStatus();
  const isVisible = (path: string) => isAdmin || !hidden.includes(path);

  const projectLinks = [
    { label: "Consultoria Financeira", path: "/consultoria" },
    { label: "Livro: A Casa dos 20", path: "/livro" },
    { label: "Mentoria Redes Sociais", path: "/curso" },
    { label: "Agência Global", path: "/olivar-global" },
  ].filter((i) => isVisible(i.path));

  const utilLinks = [
    { label: "Sobre Mim", path: "/sobre" },
    { label: "Blog", path: "/blog" },
    { label: "Conteúdo", path: "/conteudo" },
    { label: "Contato", path: "/contato" },
  ].filter((i) => isVisible(i.path));

  return (
  <footer className="bg-background border-t border-border pt-16 pb-8">
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-heading text-xl font-bold mb-4">
            QUINZINHO<span className="text-primary">.</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Empreendedor, autor e criador de conteúdo.<br />
            Projetos, produtos e serviços num só lugar.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-colors hover:text-primary hover:border-primary"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {projectLinks.length > 0 && (
          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4">Projetos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {projectLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="transition-colors hover:text-foreground">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {utilLinks.length > 0 && (
          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {utilLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="transition-colors hover:text-foreground">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>© 2026 Quinzinho Oliveira. Todos os direitos reservados.</p>
        <Link to="/admin/login" className="transition-colors hover:text-foreground mt-2 md:mt-0">
          Painel
        </Link>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
