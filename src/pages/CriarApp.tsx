import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Rocket, Code2, Smartphone, Zap, CheckCircle2,
  MessageSquare, Clock, Shield, Star, ExternalLink,
  Dumbbell, BookOpen, Bird, Cross
} from "lucide-react";
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

const portfolio = [
  {
    name: "VYTAL",
    desc: "Desafios fitness com premiação real via Pix",
    image: appVytal,
    color: "#22c55e",
    icon: <Dumbbell size={18} />,
    url: "https://vytal.replit.app",
    tags: ["PWA", "Fitness", "Pagamentos"],
  },
  {
    name: "Casa dos 20",
    desc: "App de autoconhecimento com jornadas de 30 dias",
    image: appCasaDos20,
    color: "#7c3aed",
    icon: <BookOpen size={18} />,
    url: "https://acasados20.replit.app",
    tags: ["PWA", "Growth", "Diário"],
  },
  {
    name: "PINGO",
    desc: "Tracker de hábitos simples e bonito",
    image: appPingo,
    color: "#38bdf8",
    icon: <Bird size={18} />,
    url: "https://pingo-habits.replit.app",
    tags: ["PWA", "Hábitos", "Tracking"],
  },
  {
    name: "365 com Deus",
    desc: "Devocional diário com 365 encontros",
    image: app365Deus,
    color: "#8B7355",
    icon: <Cross size={18} />,
    url: "https://365-com-deus-1.replit.app",
    tags: ["PWA", "Devocional", "Cristão"],
  },
];

const steps = [
  { icon: MessageSquare, title: "1. Conversa Inicial", desc: "Você me conta a sua ideia. Eu entendo o problema, o público e o que faz sentido construir primeiro." },
  { icon: Code2, title: "2. Construção Rápida", desc: "Em poucas semanas, o seu app já está no ar. Sem enrolação, sem meses de espera." },
  { icon: Rocket, title: "3. Lançamento", desc: "App publicado, funcionando e pronto para os seus primeiros utilizadores. Com suporte incluído." },
];

const benefits = [
  { icon: Zap, title: "Velocidade Real", desc: "Seu app pronto em semanas, não meses. Eu uso as melhores ferramentas modernas para entregar rápido." },
  { icon: Smartphone, title: "PWA Nativo", desc: "Funciona no celular como um app real: ícone na home, notificações, offline. Sem precisar de App Store." },
  { icon: Shield, title: "Autenticação Segura", desc: "Login com Google, Apple, email. Seus utilizadores protegidos desde o dia 1." },
  { icon: Clock, title: "Suporte Contínuo", desc: "Não te largo depois de entregar. Correções, melhorias e novas features incluídas no plano." },
];

const CriarApp = () => {
  return (
    <>
      <Helmet>
        <title>Crie o Seu App | Quinzinho Oliveira</title>
        <meta name="description" content="Transformo a sua ideia num app real. Apps funcionais em semanas, não meses. Veja o portfólio e entre em contato." />
      </Helmet>

      <main className="pt-20 pb-0 min-h-screen bg-background">
        {/* Hero */}
        <section className="section-container py-20 md:py-32 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary mb-6 uppercase tracking-wider">
              <Rocket size={14} />
              Transformo ideias em apps reais
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.1] max-w-4xl mx-auto">
              Você tem a ideia.{" "}
              <span className="text-primary">Eu construo o app.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              Aplicativos web modernos, rápidos e bonitos — prontos em semanas, não meses.
              Sem complicação, sem código legado, sem promessas vazias.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
              >
                Quero Criar o Meu App <ArrowRight size={16} />
              </Link>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-medium text-base hover:bg-card transition-colors"
              >
                Ver Apps que já Criei
              </a>
            </div>
          </FadeUp>

          {/* Social proof numbers */}
          <FadeUp delay={0.4}>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-bold text-foreground">4+</p>
                <p className="text-sm text-muted-foreground mt-1">Apps Lançados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground mt-1">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-bold text-foreground">&lt;4 sem</p>
                <p className="text-sm text-muted-foreground mt-1">Tempo Médio</p>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Problem / Agitation */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground max-w-3xl mx-auto leading-tight">
                Ter uma ideia incrível e não conseguir tirá-la do papel é <span className="text-primary">frustrante</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
                Você sabe que a sua ideia tem potencial. Já imaginou as funcionalidades, o design, os utilizadores.
                Mas contratar uma agência custa uma fortuna, demora meses, e no final entregam algo que nem era o que você queria.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-foreground text-lg font-medium max-w-2xl mx-auto mt-4">
                Eu faço diferente. Trabalho direto contigo, entrego rápido, e o resultado é um app que funciona de verdade.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* How it works */}
        <section className="section-container py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Como funciona</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">Da ideia ao app em 3 passos</h2>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.1}>
                <div className="relative p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <step.icon size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Por que escolher</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">O que torna isto diferente</h2>
              </div>
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((b, i) => (
                <FadeUp key={b.title} delay={i * 0.08}>
                  <div className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                      <b.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground mb-1">{b.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="section-container py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Portfólio</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">Apps que já estão no ar</h2>
              <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
                Não são mockups. São produtos reais, com utilizadores reais.
              </p>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {portfolio.map((app, i) => (
              <FadeUp key={app.name} delay={i * 0.08}>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={app.image} alt={app.name} className="w-full h-full object-cover object-top transition-transform group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
                        {app.icon}
                      </div>
                      <span className="text-white font-heading font-bold">{app.name}</span>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">{app.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border" style={{ borderColor: app.color, color: app.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">O que está incluído</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">Tudo o que o seu app precisa</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="max-w-2xl mx-auto space-y-4">
                {[
                  "Design responsivo e moderno (mobile-first)",
                  "Autenticação segura (Google, Apple, email)",
                  "Base de dados e backend incluídos",
                  "PWA — funciona como app no celular",
                  "Domínio personalizado",
                  "Integração com pagamentos (Stripe, Pix)",
                  "Painel administrativo",
                  "Suporte pós-lançamento",
                  "SEO otimizado desde o início",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                    <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Testimonial / Trust */}
        <section className="section-container py-20 md:py-28 text-center">
          <FadeUp>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-primary fill-primary" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-heading text-foreground leading-relaxed italic">
                "Eu tinha a ideia há meses mas não sabia como começar. O Quinzinho transformou tudo num app funcional em tempo recorde. Superou todas as minhas expectativas."
              </blockquote>
              <p className="text-muted-foreground mt-4 font-medium">— Cliente satisfeito</p>
            </div>
          </FadeUp>
        </section>

        {/* Final CTA */}
        <section className="bg-primary">
          <div className="section-container py-20 md:py-28 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-tight max-w-3xl mx-auto">
                Pronto para transformar a sua ideia em realidade?
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mt-6">
                Vamos conversar. Me conta a tua ideia e eu te mostro como podemos construir juntos.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 px-10 py-4 mt-10 rounded-full bg-background text-foreground font-semibold text-base hover:bg-background/90 transition-all hover:scale-105 shadow-xl"
              >
                Falar com Quinzinho <ArrowRight size={16} />
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>
    </>
  );
};

export default CriarApp;
