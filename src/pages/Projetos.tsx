import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink, Smartphone, Dumbbell, BookOpen, Bird, Cross } from "lucide-react";
import { Helmet } from "react-helmet-async";
import appVytal from "@/assets/app-vytal.png";
import appCasaDos20 from "@/assets/app-casados20.png";
import appPingo from "@/assets/app-pingo.png";
import app365Deus from "@/assets/app-365deus.jpg";

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

type AppProject = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
  appUrl: string;
  lpUrl?: string;
  tags: string[];
};

const apps: AppProject[] = [
  {
    name: "VYTAL",
    tagline: "Desafios fitness com premiação real via Pix",
    description: "Entre em desafios de exercício, faça check-ins diários com câmera e GPS, e quem cumprir fica com o prêmio. Dinheiro real em jogo, disciplina de verdade.",
    image: appVytal,
    color: "#22c55e",
    icon: <Dumbbell size={20} />,
    appUrl: "https://vytal.replit.app",
    lpUrl: "/vytal",
    tags: ["PWA", "Fitness", "Pix", "Desafios"],
  },
  {
    name: "Casa dos 20",
    tagline: "Um refúgio para quem está a atravessar a transição para a vida adulta",
    description: "App de crescimento pessoal com jornadas de 30 dias, diário privado, perguntas reflexivas e check-ins de humor. Feito para jovens dos 17 aos 30 anos.",
    image: appCasaDos20,
    color: "#7c3aed",
    icon: <BookOpen size={20} />,
    appUrl: "https://acasados20.replit.app",
    lpUrl: "/casados20",
    tags: ["PWA", "Autoconhecimento", "Jornadas", "Diário"],
  },
  {
    name: "PINGO",
    tagline: "Construa hábitos incríveis, um dia de cada vez",
    description: "Tracker de hábitos simples e bonito. Crie rotinas, acompanhe seu progresso e transforme pequenas ações em grandes mudanças.",
    image: appPingo,
    color: "#38bdf8",
    icon: <Bird size={20} />,
    appUrl: "https://pingo-habits.replit.app",
    tags: ["PWA", "Hábitos", "Produtividade", "Tracking"],
  },
  {
    name: "365 Encontros com Deus",
    tagline: "Devocional diário para fortalecer sua fé",
    description: "Aplicativo de devocional cristão com 365 encontros diários com Deus. Login com Google e Apple, interface elegante e conteúdo inspirador para cada dia do ano.",
    image: app365Deus,
    color: "#8B7355",
    icon: <Cross size={20} />,
    appUrl: "https://365-com-deus-1.replit.app",
    tags: ["PWA", "Devocional", "Fé", "Cristão"],
  },
];

const Projetos = () => {
  return (
    <>
      <Helmet>
        <title>Projetos & Apps | Quinzinho Oliveira</title>
        <meta name="description" content="Apps e projetos criados por Quinzinho Oliveira: VYTAL, Casa dos 20 e PINGO Habits." />
      </Helmet>

      <main className="pt-20 pb-24 min-h-screen bg-background">
        {/* Hero */}
        <section className="section-container py-16 md:py-24 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground mb-6">
              <Smartphone size={14} />
              APPS & PROJETOS
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight max-w-3xl mx-auto">
              Coisas que eu <span className="text-primary">construí</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-6">
              Aplicativos reais, resolvendo problemas reais. Cada projeto nasceu de uma necessidade que eu vi de perto.
            </p>
          </FadeUp>
        </section>

        {/* Apps Grid */}
        <section className="section-container pb-24 space-y-20 md:space-y-32">
          {apps.map((app, i) => {
            const isEven = i % 2 === 0;
            return (
              <FadeUp key={app.name} delay={0.1}>
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-center`}>
                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div
                      className="absolute inset-0 rounded-2xl opacity-20 blur-3xl transition-opacity group-hover:opacity-30"
                      style={{ backgroundColor: app.color }}
                    />
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
                      <img src={app.image} alt={`${app.name} app`} className="w-full h-auto" loading="lazy" />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
                          {app.icon}
                        </div>
                        <span className="text-white font-heading font-bold text-lg">{app.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {app.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border" style={{ borderColor: app.color, color: app.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{app.name}</h2>
                    <p className="text-primary font-medium text-lg">{app.tagline}</p>
                    <p className="text-muted-foreground text-base leading-relaxed">{app.description}</p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={app.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white transition-all hover:scale-105"
                        style={{ backgroundColor: app.color }}
                      >
                        Abrir App <ExternalLink size={14} />
                      </a>
                      {app.lpUrl && (
                        <Link
                          to={app.lpUrl}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-border text-foreground hover:bg-card transition-colors"
                        >
                          Ver Landing Page <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </section>

        {/* CTA */}
        <section className="section-container pb-24 text-center">
          <FadeUp>
            <div className="max-w-2xl mx-auto p-10 rounded-2xl border border-border bg-card">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                Tem uma ideia de app?
              </h3>
              <p className="text-muted-foreground mb-6">
                Eu transformo ideias em produtos reais. Se você tem um projeto em mente, vamos conversar.
              </p>
              <Link
                to="/criar-app"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Entrar em Contato <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </section>
      </main>
    </>
  );
};

export default Projetos;
