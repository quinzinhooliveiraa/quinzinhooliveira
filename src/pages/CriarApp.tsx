import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Rocket, Code2, Smartphone, Zap, CheckCircle2,
  MessageSquare, Clock, Shield, Star, ExternalLink,
  Dumbbell, BookOpen, Bird, Cross, XCircle, Sparkles
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
  },
  {
    name: "Casa dos 20",
    desc: "App de autoconhecimento com jornadas de 30 dias",
    image: appCasaDos20,
    color: "#7c3aed",
    icon: <BookOpen size={18} />,
    url: "https://acasados20.replit.app",
  },
  {
    name: "PINGO",
    desc: "Tracker de hábitos simples e bonito",
    image: appPingo,
    color: "#38bdf8",
    icon: <Bird size={18} />,
    url: "https://pingo-habits.replit.app",
  },
  {
    name: "365 com Deus",
    desc: "Devocional diário com 365 encontros",
    image: app365Deus,
    color: "#8B7355",
    icon: <Cross size={18} />,
    url: "https://365-com-deus-1.replit.app",
  },
];

const painPoints = [
  { icon: XCircle, text: "Contratar uma agência que cobra R$ 30.000+ e demora 6 meses" },
  { icon: XCircle, text: "Freelancers que somem no meio do projeto" },
  { icon: XCircle, text: "Aprender a programar sozinho (levaria anos)" },
  { icon: XCircle, text: "Usar plataformas limitadas que não fazem o que você precisa" },
];

const steps = [
  { num: "01", icon: MessageSquare, title: "Me conta a tua ideia", desc: "Uma conversa rápida. Sem compromisso. Eu entendo o que você quer resolver, para quem, e o que faz sentido construir primeiro." },
  { num: "02", icon: Code2, title: "Eu construo", desc: "Em poucas semanas, o app ganha vida. Você acompanha cada etapa, dá feedback, e ajusta antes do lançamento." },
  { num: "03", icon: Rocket, title: "Seu app no ar", desc: "App publicado, domínio configurado, utilizadores entrando. E eu continuo aqui para o que precisar depois." },
];

const includes = [
  "Design moderno e responsivo (mobile-first)",
  "Autenticação segura (Google, Apple, email)",
  "Base de dados e backend completo",
  "Funciona como app no celular (PWA)",
  "Domínio personalizado incluído",
  "Integração com pagamentos (Stripe, Pix)",
  "Painel administrativo",
  "SEO otimizado",
  "30 dias de suporte pós-lançamento",
];

const CriarApp = () => {
  return (
    <>
      <Helmet>
        <title>Crie o Seu App | Quinzinho Oliveira</title>
        <meta name="description" content="Transformo a sua ideia num app real em semanas. Desenvolvimento de aplicativos web modernos com design, backend e suporte incluídos." />
      </Helmet>

      <main className="pt-20 pb-0 min-h-screen bg-background overflow-x-hidden">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="section-container py-20 md:py-32 text-center relative">
          {/* Subtle gradient blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary mb-8 uppercase tracking-wider">
              <Sparkles size={14} />
              Desenvolvimento de Apps
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.08] max-w-4xl mx-auto">
              A sua ideia merece{" "}
              <span className="text-primary">sair do papel</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              Eu construo apps web modernos, bonitos e funcionais — em semanas, não meses.
              Você foca na ideia. Eu cuido de todo o resto.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
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

          {/* Stats */}
          <FadeUp delay={0.4}>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 mt-20 pt-8 border-t border-border">
              {[
                { value: "4+", label: "Apps no Ar" },
                { value: "<4 sem", label: "Tempo Médio" },
                { value: "100%", label: "Satisfação" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-heading font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ PAIN / AGITATION ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground max-w-3xl mx-auto leading-tight">
                  Você já tentou tirar a sua ideia do papel?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
                  Se é como a maioria das pessoas, provavelmente já pensou nestas opções:
                </p>
              </div>
            </FadeUp>

            <div className="max-w-2xl mx-auto space-y-4">
              {painPoints.map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border">
                    <p.icon size={20} className="text-destructive shrink-0 mt-0.5" />
                    <span className="text-foreground">{p.text}</span>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.4}>
              <div className="text-center mt-12">
                <p className="text-xl md:text-2xl font-heading font-bold text-foreground">
                  E se houvesse uma forma <span className="text-primary">mais simples</span>?
                </p>
                <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                  Um developer que trabalha direto contigo, entrega rápido, e constrói exatamente o que você precisa — sem surpresas.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
        <section className="section-container py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Processo</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                Da ideia ao app em 3 passos
              </h2>
            </div>
          </FadeUp>

          <div className="max-w-4xl mx-auto space-y-0">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.12}>
                <div className="flex gap-6 md:gap-10 items-start py-10 border-b border-border last:border-0">
                  <div className="text-5xl md:text-7xl font-heading font-bold text-primary/15 leading-none shrink-0 select-none">
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <step.icon size={20} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{step.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ═══════════════════ PORTFOLIO ═══════════════════ */}
        <section id="portfolio" className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Prova Real</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Apps que já estão no ar
                </h2>
                <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
                  Não são mockups. São produtos reais, com utilizadores reais, que eu construí do zero.
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
                    className="group block rounded-2xl border border-border bg-background overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
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
                    </div>
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ WHAT'S INCLUDED ═══════════════════ */}
        <section className="section-container py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Entrega</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                Tudo o que está incluído
              </h2>
              <p className="text-muted-foreground text-lg mt-4 max-w-lg mx-auto">
                Sem custos escondidos. Sem surpresas. Um pacote completo.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="max-w-2xl mx-auto grid gap-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ WHY ME ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Diferencial</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Por que trabalhar comigo?
                </h2>
              </div>
            </FadeUp>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Zap, title: "Velocidade", desc: "Apps prontos em semanas. Uso as melhores tecnologias modernas para entregar rápido sem sacrificar qualidade." },
                { icon: Smartphone, title: "Experiência Real", desc: "Não entrego só código. Entrego um produto que as pessoas querem usar. Design limpo, UX pensada, performance." },
                { icon: Shield, title: "Sem Risco", desc: "Você acompanha cada etapa. Se não gostar da direção, ajustamos. Transparência total do início ao fim." },
                { icon: Clock, title: "Parceria, não projeto", desc: "Continuo depois do lançamento. Correções, novas features, suporte. Seu app continua a evoluir." },
              ].map((b, i) => (
                <FadeUp key={b.title} delay={i * 0.08}>
                  <div className="flex gap-4 p-6 rounded-xl border border-border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <b.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground mb-1.5">{b.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIAL ═══════════════════ */}
        <section className="section-container py-20 md:py-28 text-center">
          <FadeUp>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-primary fill-primary" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-heading text-foreground leading-relaxed">
                "Eu tinha a ideia há meses mas não sabia por onde começar. O Quinzinho transformou tudo num app funcional em tempo recorde. Superou todas as expectativas."
              </blockquote>
              <p className="text-muted-foreground mt-6 font-medium">— Cliente satisfeito</p>
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Perguntas frequentes
                </h2>
              </div>
            </FadeUp>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { q: "Quanto custa criar um app?", a: "Depende da complexidade. Fazemos uma conversa inicial gratuita onde eu analiso a sua ideia e te dou um orçamento justo e transparente. Sem surpresas." },
                { q: "Quanto tempo demora?", a: "A maioria dos apps fica pronta entre 2 a 4 semanas. Projetos mais complexos podem levar até 6 semanas." },
                { q: "Preciso saber programar?", a: "Não! Você só precisa da ideia. Eu cuido de toda a parte técnica: design, código, banco de dados, hospedagem." },
                { q: "O app funciona no celular?", a: "Sim! Todos os apps são PWAs — funcionam como aplicativos nativos no celular, com ícone na tela e tudo mais, sem precisar de App Store." },
                { q: "E depois de lançar?", a: "Não te abandono. Ofereço 30 dias de suporte incluído e planos de manutenção contínua para quem quiser evoluir o app." },
                { q: "Posso ver apps que você já criou?", a: "Claro! Basta rolar até a seção de portfólio nesta página. Todos os apps estão no ar e funcionando." },
              ].map((faq, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <details className="group p-5 rounded-xl border border-border bg-background cursor-pointer">
                    <summary className="flex items-center justify-between font-heading font-bold text-foreground list-none">
                      {faq.q}
                      <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-3 pr-8">{faq.a}</p>
                  </details>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="section-container py-20 md:py-28 text-center relative z-10">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-tight max-w-3xl mx-auto">
                A sua ideia merece existir.
                <br />
                <span className="opacity-80">Vamos construir juntos?</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mt-6">
                A conversa inicial é gratuita e sem compromisso. Me conta a tua ideia e eu te mostro o caminho.
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
