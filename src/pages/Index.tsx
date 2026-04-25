import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSiteSetting } from "@/hooks/use-site-settings";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminEditOverlay } from "@/components/admin/AdminEditOverlay";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";
import quinzinhoHero from "@/assets/quinzinho-hero.jpg";
import quinzinhoAbout from "@/assets/quinzinho-new.jpg";

import thumbLivro from "@/assets/thumb-livro-new2.jpeg";
import thumbConsultoria from "@/assets/thumb-consultoria-new.png";
import thumbCurso from "@/assets/thumb-curso-new.jpeg";
import thumbRoupa from "@/assets/thumb-rborn.png";
import thumbOlivarContent from "@/assets/thumb-olivar-content.jpeg";
import thumbYoutube from "@/assets/thumb-youtube.jpeg";
import thumbInstaPessoal from "@/assets/thumb-insta-pessoal.png";
import thumbOlsProject from "@/assets/thumb-olsproject.png";
import thumbBlog from "@/assets/thumb-blog.jpg";
import thumbServicos from "@/assets/thumb-servicos.jpg";
import thumbCriarApp from "@/assets/thumb-criar-app.jpg";
import thumbConteudo from "@/assets/thumb-conteudo.jpg";
import thumbTiktokPessoal from "@/assets/thumb-tiktok-pessoal.jpeg";
import thumbLinkedin from "@/assets/thumb-linkedin.jpeg";
import { useHiddenPages } from "@/hooks/use-page-visibility";
import { useAdminStatus } from "@/hooks/use-admin-status";

type ProjectItem = {
  label: string;
  desc: string;
  image: string;
  link?: string;
  badge?: string;
  external?: string;
};

const projetos: ProjectItem[] = [
  { label: "A Casa dos 20", desc: "5.000+ vendidos", image: thumbLivro, link: "/livro" },
  { label: "Consultoria Financeira", desc: "Planejamento pessoal", image: thumbConsultoria, link: "/consultoria" },
  { label: "Curso Redes Sociais", desc: "Em breve", image: thumbCurso, badge: "EM BREVE", link: "/curso" },
  { label: "Olivar Global", desc: "Comércio exterior", image: thumbOlivarContent, link: "/olivar-global" },
  { label: "Criar App", desc: "Transformo a tua ideia em app", image: thumbCriarApp, badge: "NOVO", link: "/projetos" },
  { label: "OLSPROJECT", desc: "Comunidade de desenvolvimento pessoal e profissional", image: thumbOlsProject, badge: "NOVO", link: "/olsproject" },
  { label: "Rborn", desc: "Marca de roupas", image: thumbRoupa, badge: "EM DEV" },
  { label: "Serviços", desc: "Todos num só lugar", image: thumbServicos, link: "/servicos" },
];

const conteudo: ProjectItem[] = [
  { label: "YouTube", desc: "Vídeos meus sobre o que penso", image: thumbYoutube, badge: "CANAL", external: "https://www.youtube.com/@quinzinhooliveira" },
  { label: "Instagram Pessoal", desc: "Onde me sinto à vontade", image: thumbInstaPessoal, external: "https://www.instagram.com/quinzinhooliveiraa_" },
  { label: "TikTok Pessoal", desc: "Expressão livre", image: thumbTiktokPessoal, external: "https://www.tiktok.com/@quinzinhooliveiraa_" },
  { label: "LinkedIn", desc: "Networking profissional", image: thumbLinkedin, external: "https://www.linkedin.com/in/joaquim-emmanuel-oliveira/" },
  { label: "Blog", desc: "Artigos e reflexões", image: thumbBlog, link: "/blog" },
  { label: "Todas as Plataformas", desc: "O propósito de cada uma", image: thumbConteudo, link: "/conteudo" },
];

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function NetflixRow({ title, items }: { title: string; items: ProjectItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: "-50px" });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mb-10 sm:mb-12">
      <motion.h2
        ref={titleRef}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-4 sm:px-6 lg:px-8"
      >
        {title}
      </motion.h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 sm:w-12 bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, i) => {
            const Card = (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-60 cursor-pointer snap-start"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] group-hover:border-primary/40">
                  <img src={item.image} alt={item.label} className={`w-full h-full object-cover transition-all duration-500 ${title === "Conteúdo" ? "grayscale group-hover:grayscale-0" : ""}`} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  {item.badge && (
                    <span className="absolute top-2 right-2 sm:top-3 sm:right-3 category-badge text-[9px] sm:text-[10px]">{item.badge}</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-heading font-bold text-xs sm:text-sm md:text-base text-foreground leading-tight mb-1">{item.label}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );

            if (item.external) {
              return <a key={item.label} href={item.external} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 snap-start">{Card}</a>;
            }
            if (item.link) {
              return <Link key={item.label} to={item.link} className="flex-shrink-0 snap-start">{Card}</Link>;
            }
            return Card;
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 sm:w-12 bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronRight size={24} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}

function normalizeYouTubeEmbedUrl(input: string) {
  const raw = input.trim();
  if (!raw) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : raw;
    }

    if (host.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return raw;

      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : raw;
      }

      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/embed/${id}` : raw;
      }
    }
  } catch {
    return raw;
  }

  return raw;
}

function HomepageVideo() {
  const { value: videoUrl, update } = useSiteSetting(
    "homepage_video_url",
    "https://www.youtube.com/embed/LShHHIJ4urk?si=vU14gKywHmaSw2wr"
  );

  const embedUrl = normalizeYouTubeEmbedUrl(videoUrl);

  const handleSave = async (newUrl: string) => {
    await update(normalizeYouTubeEmbedUrl(newUrl));
  };

  return (
    <AdminEditOverlay value={videoUrl} onSave={handleSave} label="Editar vídeo" type="url">
      <div className="max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden border border-border shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </AdminEditOverlay>
  );
}

const Index = () => {
  const { hidden } = useHiddenPages();
  const { isAdmin } = useAdminStatus();
  const isVisible = (link?: string) => !link || !link.startsWith("/") || isAdmin || !hidden.includes(link);
  const visibleProjetos = projetos.filter((p) => isVisible(p.link));
  const visibleConteudo = conteudo.filter((p) => isVisible(p.link));

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 7%)', color: 'hsl(0, 0%, 95%)' }}>
        <div className="absolute inset-0">
          <AdminImage
            settingKey="homepage_hero_image"
            fallbackSrc={quinzinhoHero}
            alt="Quinzinho Oliveira"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,7%)] via-[hsl(0,0%,7%)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,7%)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 section-container w-full">
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-2"
            >
              Quinzinho
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 text-primary"
            >
              Oliveira.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-[hsl(0,0%,55%)] mb-8 max-w-lg"
            >
              Empreendedor, autor e criador de conteúdo.<br />
              Aqui você encontra meus projetos, produtos e tudo que estou construindo.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <AdminEditableLink
                settingKey="hero_cta_contato"
                defaultHref="/contato"
                className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm text-center"
              >
                Entrar em Contato
              </AdminEditableLink>
              <AdminEditableLink
                settingKey="hero_cta_livro"
                defaultHref="/livro"
                className="px-8 py-3 border border-[hsl(0,0%,30%)] text-[hsl(0,0%,95%)] font-bold rounded-full transition-all hover:border-primary hover:text-primary uppercase tracking-wide text-sm text-center"
              >
                Ler o Livro
              </AdminEditableLink>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Netflix-style sections */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto">
        <NetflixRow title="Projetos" items={visibleProjetos} />
        <NetflixRow title="Conteúdo" items={visibleConteudo} />
      </section>

      {/* YouTube Featured Video */}
      <FadeUp>
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">Último do Canal</h2>
            <HomepageVideo />
          </div>
        </section>
      </FadeUp>

      {/* About */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <FadeUp>
              <div className="flex justify-center">
                <AdminImage settingKey="homepage_about_image" fallbackSrc={quinzinhoAbout} alt="Quinzinho Oliveira" className="w-56 sm:w-72 mx-auto rounded-xl shadow-2xl img-bw" />
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6">Quem sou eu?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                  Meu nome é Quinzinho Oliveira. Sempre tive interesse em criar, mas demorei a perceber que essa era a linha que conectava tudo na minha vida.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                  Em criança, desenhava. Na adolescência, virei DJ e producer, criando músicas e remixes. Depois veio a dança, a fotografia, a edição, os vídeos. Cada fase era diferente, mas o impulso era o mesmo: criar algo.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                  Esse caminho me levou a empreender, escrever um livro best seller e hoje construir com tecnologia. Os sinais sempre estiveram lá.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/sobre" className="inline-flex items-center gap-2 text-primary font-medium transition-opacity hover:opacity-80">
                    Saber mais <ArrowRight size={16} />
                  </Link>
                  <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-medium transition-opacity hover:opacity-80">
                    Ler o Blog <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
