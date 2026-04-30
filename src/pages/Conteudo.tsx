import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Youtube, Instagram, BookOpen, Music, Linkedin, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";
import thumbTiktokPessoal from "@/assets/thumb-tiktok-pessoal.jpeg";
import thumbLinkedin from "@/assets/thumb-linkedin.jpeg";

// Simple slug helper for stable settingKey derivation
const slugifyName = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const pessoais = [
  {
    icon: Youtube,
    name: "YouTube",
    color: "hsl(0, 70%, 50%)",
    purpose: "Liberdade para pensar em voz alta",
    description: "Criei o YouTube porque penso em muita coisa que não cabe em 30 segundos. Aqui me expresso livremente, sem pressão de formato curto ou nicho. É onde conecto com as pessoas de verdade, compartilhando reflexões, aprendizados e tudo que me interessa.",
    link: "https://www.youtube.com/@quinzinhooliveira",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram Pessoal",
    color: "hsl(330, 70%, 50%)",
    purpose: "Onde me sinto à vontade",
    description: "O meu Instagram pessoal é onde sou mais livre. Posto quando quero, o que quero, na hora que quero. Sem regras, sem pressão de crescer ou fechar contratos. É o lugar onde o conteúdo é genuinamente para mim.",
    link: "https://www.instagram.com/quinzinhooliveiraa_",
    external: true,
  },
  {
    icon: Music,
    name: "TikTok Pessoal",
    color: "hsl(0, 0%, 90%)",
    purpose: "Expressão livre",
    description: "Meu TikTok pessoal é onde me expresso sem compromisso. Posto o que dá vontade, sem estratégia. É puro impulso criativo.",
    link: "https://www.tiktok.com/@quinzinhooliveiraa_",
    external: true,
    image: thumbTiktokPessoal,
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    color: "hsl(210, 80%, 45%)",
    purpose: "Networking e conexões profissionais",
    description: "LinkedIn é onde conecto com outros profissionais, compartilho conquistas e mantenho minha rede ativa. É o lado mais corporativo, mas ainda com a minha voz.",
    link: "https://www.linkedin.com/in/joaquim-emmanuel-oliveira/",
    external: true,
    image: thumbLinkedin,
  },
  {
    icon: BookOpen,
    name: "Blog",
    color: "hsl(var(--primary))",
    purpose: "Meu diário de pensamentos",
    description: "O blog é meu espaço para escrever. Compartilho reflexões, conteúdo sobre finanças, vibe coding e tudo que me interessa. Escrever sempre foi uma forma de organizar o pensamento.",
    link: "/blog",
  },
];

const projetos = [
  {
    icon: Instagram,
    name: "Instagram - A Casa dos 20",
    color: "hsl(330, 70%, 50%)",
    description: "Conteúdo relacionado ao livro A Casa dos 20.",
    link: "https://www.instagram.com/quinzinhooliveira_",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram - Crescimento de Redes",
    color: "hsl(270, 60%, 50%)",
    description: "Social media, curso e dicas para crescer nas redes sociais.",
    link: "https://www.instagram.com/oliveirasocial_",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram - Consultoria Financeira",
    color: "hsl(160, 80%, 40%)",
    description: "Conteúdo sobre finanças pessoais e consultoria.",
    link: "https://www.instagram.com/oliveiracapital_",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram - OLSPROJECT",
    color: "hsl(45, 100%, 50%)",
    description: "Comunidade e autodesenvolvimento.",
    link: "https://www.instagram.com/olsproject",
    external: true,
  },
  {
    icon: Youtube,
    name: "YouTube - OLSPROJECT",
    color: "hsl(0, 70%, 50%)",
    description: "Canal da comunidade OLSPROJECT.",
    link: "http://www.youtube.com/@OLSPROJECT_",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram - Olivar Global",
    color: "hsl(200, 60%, 50%)",
    description: "Agência de comércio exterior.",
    link: "https://www.instagram.com/olivarglobalsale",
    external: true,
  },
  {
    icon: Instagram,
    name: "Instagram - RBORN",
    color: "hsl(0, 0%, 70%)",
    description: "Marca de roupas.",
    link: "https://www.instagram.com/_rborn_",
    external: true,
  },
  {
    icon: Music,
    name: "TikTok - Redes Sociais",
    color: "hsl(0, 0%, 90%)",
    description: "Conteúdo sobre crescimento em redes sociais.",
    link: "https://www.tiktok.com/@quinzinhooliveira_",
    external: true,
  },
  {
    icon: Music,
    name: "TikTok - OLSPROJECT",
    color: "hsl(45, 100%, 50%)",
    description: "Conteúdo da comunidade OLS.",
    link: "https://www.tiktok.com/@olsproject",
    external: true,
  },
  {
    icon: Music,
    name: "TikTok - Profissional",
    color: "hsl(270, 60%, 50%)",
    description: "Conteúdo profissional e de negócios.",
    link: "https://www.tiktok.com/@joaquimoliveiraa__",
    external: true,
  },
];

type PlatformItem = {
  icon: React.ComponentType<any>;
  name: string;
  color: string;
  purpose?: string;
  description: string;
  link: string;
  external?: boolean;
  image?: string;
};

function PlatformCard({ platform }: { platform: PlatformItem }) {
  const settingKey = `conteudo_platform_${slugifyName(platform.name)}`;
  const LinkWrapper = ({ children, className }: { children: React.ReactNode; className: string }) => (
    <AdminEditableLink
      settingKey={settingKey}
      defaultHref={platform.link}
      external={!!platform.external}
      className={className}
    >
      {children}
    </AdminEditableLink>
  );

  return (
    <div className="group flex flex-col sm:flex-row gap-5 p-6 sm:p-8 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all duration-300">
      {platform.image ? (
        <div className="flex-shrink-0">
          <img
            src={platform.image}
            alt={platform.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 flex items-start">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${platform.color}15` }}
          >
            <platform.icon size={24} style={{ color: platform.color }} />
          </div>
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-heading text-lg font-bold mb-1">{platform.name}</h3>
        {platform.purpose && (
          <p className="text-primary text-sm font-medium mb-2">{platform.purpose}</p>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed">{platform.description}</p>
        {platform.link !== "#" && (
          <LinkWrapper className="inline-flex items-center gap-2 text-primary text-sm font-medium mt-3 hover:opacity-80 transition-opacity">
            Acessar {platform.external ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
          </LinkWrapper>
        )}
      </div>
    </div>
  );
}

const Conteudo = () => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <SEO
        title="Conteúdo"
        description="YouTube, Instagram, TikTok, LinkedIn e Blog. Conheça o propósito de cada plataforma onde o Quinzinho Oliveira cria conteúdo."
      />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 md:py-28 overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 7%)', color: 'hsl(0, 0%, 95%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative z-10 section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
          >
            Conteúdo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[hsl(0,0%,55%)] text-base sm:text-lg max-w-2xl mx-auto"
          >
            Cada plataforma tem um propósito. Aqui explico por que criei cada uma
            e o que você vai encontrar em cada lugar.
          </motion.p>
        </div>
      </section>

      {/* Pessoais */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="section-container max-w-4xl">
          <FadeUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Plataformas pessoais</h2>
          </FadeUp>
          <div className="space-y-4 sm:space-y-6">
            {pessoais.map((platform, i) => (
              <FadeUp key={platform.name} delay={i * 0.08}>
                <PlatformCard platform={platform} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary/30">
        <div className="section-container max-w-4xl">
          <FadeUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Redes dos projetos</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">Cada projeto tem sua própria rede social.</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {projetos.map((platform, i) => (
              <FadeUp key={platform.name} delay={i * 0.05}>
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <platform.icon size={20} style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-bold truncate">{platform.name}</h3>
                    <p className="text-muted-foreground text-xs truncate">{platform.description}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeUp>
        <section className="py-12 sm:py-16 md:py-20">
          <div className="section-container text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Quer acompanhar?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Escolhe a plataforma que mais combina contigo e vamos nos conectar.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
            >
              Começar pelo Blog <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </FadeUp>
    </div>
  );
};

export default Conteudo;
