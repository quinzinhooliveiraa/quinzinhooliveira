import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Video, Globe, Smartphone, Users, Code, Palette } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";

const services = [
  {
    icon: Video,
    title: "Edição de Vídeo",
    desc: "Edição profissional com ritmo, estética e storytelling. Desde vídeos curtos para redes sociais até projetos mais elaborados para YouTube e campanhas.",
  },
  {
    icon: Globe,
    title: "Landing Pages & Sites Institucionais",
    desc: "Criação de páginas de alta conversão para empresas e marcas pessoais. Design moderno, responsivo e otimizado para SEO.",
  },
  {
    icon: Code,
    title: "Vibe Coding",
    desc: "Desenvolvimento de aplicativos, plataformas e projetos digitais usando IA como copiloto. Da ideia ao produto, com velocidade e qualidade.",
  },
  {
    icon: Smartphone,
    title: "Aplicativos",
    desc: "Criação de apps sob medida, desde MVPs até produtos completos. Foco em experiência do usuário e funcionalidade real.",
  },
  {
    icon: Users,
    title: "Social Media",
    desc: "Gestão de redes sociais com estratégia de conteúdo, criação de posts, stories e reels. Construção de presença digital autêntica.",
  },
  {
    icon: Palette,
    title: "Identidade Visual",
    desc: "Desenvolvimento de identidade visual para marcas, incluindo logo, paleta de cores, tipografia e guidelines.",
  },
];

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

const Servicos = () => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <Helmet>
        <title>Serviços | Quinzinho Oliveira</title>
        <meta name="description" content="Edição de vídeo, criação de sites, landing pages, aplicativos, social media e vibe coding. Conheça todos os serviços do Quinzinho Oliveira." />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 7%)', color: 'hsl(0, 0%, 95%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative z-10 section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            Serviços
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[hsl(0,0%,55%)] text-lg max-w-2xl mx-auto"
          >
            Tudo o que aprendi criando ao longo da vida, agora como serviço.
            Do vídeo ao código, da estratégia à execução.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <FadeUp key={service.title} delay={i * 0.08}>
                <div className="group p-6 sm:p-8 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <service.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.desc}</p>
                  <Link to="/contato" className="inline-flex items-center gap-2 text-primary text-sm font-medium mt-4 hover:opacity-80 transition-opacity">
                    Entre em contato <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <FadeUp>
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="section-container text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Tem um projeto em mente?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Cada projeto é único. Entre em contato e vamos conversar sobre como posso ajudar.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
            >
              Iniciar Contato <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </FadeUp>
    </div>
  );
};

export default Servicos;
