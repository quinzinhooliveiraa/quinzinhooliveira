import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import SEO from "@/components/SEO";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";
import {
  ArrowRight, Rocket, Code2, Smartphone, Zap, CheckCircle2,
  MessageSquare, Clock, Shield, Star, ExternalLink,
  Dumbbell, BookOpen, Bird, Cross, XCircle, Sparkles
} from "lucide-react";
import appVytal from "@/assets/app-vytal.png";
import appCasaDos20 from "@/assets/app-casados20.png";
import appPingo from "@/assets/app-pingo.png";
import app365Deus from "@/assets/app-365deus.jpg";

const slugifyName = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const apps = [
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

const Projetos = () => {
  return (
    <>
      <SEO
        title="Projetos & Criar App"
        description="Apps criados por Quinzinho Oliveira e serviço de desenvolvimento. Transformo a sua ideia num app real em semanas."
      />

      <main className="pt-14 sm:pt-16 pb-0 min-h-screen bg-background overflow-x-hidden">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="section-container py-12 sm:py-20 md:py-32 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] sm:text-xs font-semibold text-primary mb-6 sm:mb-8 uppercase tracking-wider">
              <Sparkles size={14} />
              Apps & Desenvolvimento
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.08] max-w-4xl mx-auto">
              Coisas que eu <span className="text-primary">construí</span> — e posso construir pra ti
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed">
              Aplicativos reais, resolvendo problemas reais. Cada projeto nasceu de uma necessidade que eu vi de perto.
              Tem uma ideia? Eu transformo em produto.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
              >
                Quero Criar o Meu App <ArrowRight size={16} />
              </Link>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-border text-foreground font-medium text-sm sm:text-base hover:bg-card transition-colors"
              >
                Ver Apps que já Criei
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-10 md:gap-20 mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-border">
              {[
                { value: "4+", label: "Apps no Ar" },
                { value: "<4 sem", label: "Tempo Médio" },
                { value: "100%", label: "Satisfação" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">{s.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ PORTFOLIO ═══════════════════ */}
        <section id="portfolio" className="bg-card border-y border-border">
          <div className="section-container py-12 sm:py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-16">
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">Portfólio</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Apps que já estão no ar
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mt-3 sm:mt-4 max-w-xl mx-auto">
                  Não são mockups. São produtos reais, com utilizadores reais, que eu construí do zero.
                </p>
              </div>
            </FadeUp>

            <div className="space-y-12 sm:space-y-20 md:space-y-32 max-w-6xl mx-auto">
              {apps.map((app, i) => {
                const isEven = i % 2 === 0;
                return (
                  <FadeUp key={app.name} delay={0.1}>
                    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-6 sm:gap-8 lg:gap-16 items-center`}>
                      <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-0 rounded-2xl opacity-20 blur-3xl transition-opacity group-hover:opacity-30" style={{ backgroundColor: app.color }} />
                        <div className="relative rounded-2xl overflow-hidden border border-border bg-background shadow-2xl">
                          <img src={app.image} alt={`${app.name} app`} className="w-full h-auto" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
                              {app.icon}
                            </div>
                            <span className="text-white font-heading font-bold text-base sm:text-lg">{app.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-1/2 space-y-3 sm:space-y-5">
                        <div className="flex flex-wrap gap-2">
                          {app.tags.map((tag) => (
                            <span key={tag} className="px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-full border" style={{ borderColor: app.color, color: app.color }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">{app.name}</h2>
                        <p className="text-primary font-medium text-base sm:text-lg">{app.tagline}</p>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{app.description}</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                          <AdminEditableLink
                            settingKey={`projetos_${slugifyName(app.name)}_app`}
                            defaultHref={app.appUrl}
                            external
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white transition-all hover:scale-105"
                            style={{ backgroundColor: app.color }}
                          >
                            Abrir App <ExternalLink size={14} />
                          </AdminEditableLink>
                          {app.lpUrl && (
                            <AdminEditableLink
                              settingKey={`projetos_${slugifyName(app.name)}_lp`}
                              defaultHref={app.lpUrl}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-border text-foreground hover:bg-card transition-colors"
                            >
                              Ver Landing Page <ArrowRight size={14} />
                            </AdminEditableLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ PAIN / AGITATION ═══════════════════ */}
        <section className="section-container py-12 sm:py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">Serviço</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground max-w-3xl mx-auto leading-tight">
                Tem uma ideia de app?<br />Eu faço acontecer.
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mt-4 sm:mt-5 leading-relaxed">
                Se é como a maioria das pessoas, provavelmente já pensou nestas opções:
              </p>
            </div>
          </FadeUp>

          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            {painPoints.map((p, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-card border border-border">
                  <p.icon size={18} className="text-destructive shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm sm:text-base">{p.text}</span>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <div className="text-center mt-8 sm:mt-12">
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-foreground">
                E se houvesse uma forma <span className="text-primary">mais simples</span>?
              </p>
              <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-lg mx-auto">
                Um developer que trabalha direto contigo, entrega rápido, e constrói exatamente o que você precisa — sem surpresas.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-12 sm:py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-16">
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">Processo</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Da ideia ao app em 3 passos
                </h2>
              </div>
            </FadeUp>

            <div className="max-w-4xl mx-auto space-y-0">
              {steps.map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.12}>
                  <div className="flex gap-4 sm:gap-6 md:gap-10 items-start py-6 sm:py-10 border-b border-border last:border-0">
                    <div className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-primary/15 leading-none shrink-0 select-none">
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <step.icon size={18} />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">{step.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ WHAT'S INCLUDED ═══════════════════ */}
        <section className="section-container py-12 sm:py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">Entrega</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground">
                Tudo o que está incluído
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mt-3 sm:mt-4 max-w-lg mx-auto">
                Sem custos escondidos. Sem surpresas. Um pacote completo.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="max-w-2xl mx-auto grid gap-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span className="text-foreground font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ WHY ME ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-12 sm:py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">Diferencial</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Por que trabalhar comigo?
                </h2>
              </div>
            </FadeUp>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { icon: Zap, title: "Velocidade", desc: "Apps prontos em semanas. Uso as melhores tecnologias modernas para entregar rápido sem sacrificar qualidade." },
                { icon: Smartphone, title: "Experiência Real", desc: "Não entrego só código. Entrego um produto que as pessoas querem usar. Design limpo, UX pensada, performance." },
                { icon: Shield, title: "Sem Risco", desc: "Você acompanha cada etapa. Se não gostar da direção, ajustamos. Transparência total do início ao fim." },
                { icon: Clock, title: "Parceria, não projeto", desc: "Continuo depois do lançamento. Correções, novas features, suporte. Seu app continua a evoluir." },
              ].map((b, i) => (
                <FadeUp key={b.title} delay={i * 0.08}>
                  <div className="flex gap-3 sm:gap-4 p-5 sm:p-6 rounded-xl border border-border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <b.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground mb-1.5 text-sm sm:text-base">{b.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIAL ═══════════════════ */}
        <section className="section-container py-12 sm:py-20 md:py-28 text-center">
          <FadeUp>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-primary fill-primary" />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl md:text-2xl font-heading text-foreground leading-relaxed">
                "Eu tinha a ideia há meses mas não sabia por onde começar. O Quinzinho transformou tudo num app funcional em tempo recorde. Superou todas as expectativas."
              </blockquote>
              <p className="text-muted-foreground text-sm sm:text-base mt-4 sm:mt-6 font-medium">— Cliente satisfeito</p>
            </div>
          </FadeUp>
        </section>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <section className="bg-card border-y border-border">
          <div className="section-container py-12 sm:py-20 md:py-28">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">FAQ</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground">
                  Perguntas frequentes
                </h2>
              </div>
            </FadeUp>

            <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
              {[
                { q: "Quanto custa criar um app?", a: "Depende da complexidade. Fazemos uma conversa inicial gratuita onde eu analiso a sua ideia e te dou um orçamento justo e transparente. Sem surpresas." },
                { q: "Quanto tempo demora?", a: "A maioria dos apps fica pronta entre 2 a 4 semanas. Projetos mais complexos podem levar até 6 semanas." },
                { q: "Preciso saber programar?", a: "Não! Você só precisa da ideia. Eu cuido de toda a parte técnica: design, código, banco de dados, hospedagem." },
                { q: "O app funciona no celular?", a: "Sim! Todos os apps são PWAs — funcionam como aplicativos nativos no celular, com ícone na tela e tudo mais, sem precisar de App Store." },
                { q: "E depois de lançar?", a: "Não te abandono. Ofereço 30 dias de suporte incluído e planos de manutenção contínua para quem quiser evoluir o app." },
              ].map((faq, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <details className="group p-4 sm:p-5 rounded-xl border border-border bg-background cursor-pointer">
                    <summary className="flex items-center justify-between gap-3 font-heading font-bold text-foreground list-none text-sm sm:text-base">
                      {faq.q}
                      <span className="text-primary text-xl group-open:rotate-45 transition-transform shrink-0">+</span>
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

          <div className="section-container py-12 sm:py-20 md:py-28 text-center relative z-10">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-tight max-w-3xl mx-auto">
                A sua ideia merece existir.
                <br />
                <span className="opacity-80">Vamos construir juntos?</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-primary-foreground/70 text-base sm:text-lg max-w-xl mx-auto mt-4 sm:mt-6">
                A conversa inicial é gratuita e sem compromisso. Me conta a tua ideia e eu te mostro o caminho.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 mt-8 sm:mt-10 rounded-full bg-background text-foreground font-semibold text-sm sm:text-base hover:bg-background/90 transition-all hover:scale-105 shadow-xl"
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

export default Projetos;
