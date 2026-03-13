import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Star, Play, Shield, Users, TrendingUp,
  Award, Target, DollarSign, PiggyBank, Sparkles, Clock, BookOpen, Video,
  Scissors, Zap, Brain, Rocket, ImageIcon, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const modules = [
  {
    icon: Target,
    title: "Módulo 1: Fundamentos do Conteúdo",
    items: [
      "Como descobrir seu nicho e se posicionar",
      "Os 7 tipos de conteúdo que mais engajam",
      "Criar um calendário editorial estratégico"
    ]
  },
  {
    icon: DollarSign,
    title: "Módulo 2: Criação de Conteúdo",
    items: [
      "Copywriting para redes sociais (fórmulas que vendem)",
      "Como criar reels/vídeos que viralizam",
      "Design para redes: canva, templates e identidade visual"
    ]
  },
  {
    icon: PiggyBank,
    title: "Módulo 3: Crescimento e Engajamento",
    items: [
      "Estratégias de crescimento orgânico comprovadas",
      "Como usar o algoritmo a seu favor",
      "Técnicas de engajamento e construção de comunidade"
    ]
  },
  {
    icon: TrendingUp,
    title: "Módulo 4: Monetização",
    items: [
      "Como vender produtos/serviços pelas redes sociais",
      "Tráfego pago: Instagram Ads e Meta Ads do zero",
      "Parcerias, monetização e como fechar contratos"
    ]
  },
];

const bonuses = [
  { icon: BookOpen, title: "Pack de Templates Prontos", value: "R$ 297", desc: "Mais de 100 templates editáveis para Canva e CapCut" },
  { icon: Video, title: "Aulas ao Vivo Mensais", value: "R$ 297", desc: "Análise de perfis e estratégias atualizadas" },
  { icon: Users, title: "Comunidade Exclusiva", value: "R$ 497", desc: "Networking e troca com outros criadores" },
];

const faqs = [
  { q: "Preciso ter conhecimento prévio?", a: "Não! O curso foi feito para quem está começando do zero. Eu explico tudo passo a passo, desde criar o perfil até monetizar." },
  { q: "Quanto tempo leva para ver resultados?", a: "Depende da sua dedicação, mas quem aplica as estratégias com consistência costuma ver crescimento nas primeiras semanas." },
  { q: "O curso é ao vivo ou gravado?", a: "O conteúdo principal é gravado para você assistir no seu ritmo. Além disso, você terá acesso a aulas ao vivo mensais para análise de perfis e novidades." },
  { q: "Funciona para qualquer nicho?", a: "Sim! As estratégias funcionam para qualquer área: negócios, estilo de vida, educação, vendas, infoprodutos, etc." },
  { q: "Tem garantia?", a: "Sim! Se você assistir o curso, aplicar o método e não ver resultados em 30 dias, eu devolvo 100% do seu dinheiro. Sem perguntas." },
  { q: "Por quanto tempo tenho acesso?", a: "Acesso vitalício! Você pode assistir quantas vezes quiser, para sempre." },
];

const Curso = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistName.trim()) return;
    await supabase.from("contact_submissions").insert({
      name: waitlistName.trim(),
      email: waitlistEmail.trim(),
      subject: "Lista de Espera - Curso Redes Sociais",
      message: "Interesse na lista de espera do curso.",
      source: "curso",
    });
    setSubmitted(true);
    toast({
      title: "Você está na lista! 🎉",
      description: "Fique de olho no seu e-mail, avisaremos quando as vagas abrirem.",
    });
  };

  const openWaitlist = () => {
    setSubmitted(false);
    setWaitlistEmail("");
    setWaitlistName("");
    setShowWaitlist(true);
  };

  return (
    <div className="pt-16 overflow-hidden [--primary:262_83%_58%] [--primary-foreground:0_0%_100%]">
      {/* Waitlist Dialog */}
      <Dialog open={showWaitlist} onOpenChange={setShowWaitlist}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {submitted ? "Você está na lista! 🎉" : "Entre na Lista de Espera"}
            </DialogTitle>
            <DialogDescription>
              {submitted
                ? "Obrigado pelo interesse! Você será o primeiro a saber quando as inscrições abrirem."
                : "O curso ainda não está disponível. Cadastre-se para ser avisado assim que as vagas abrirem, com condição especial."}
            </DialogDescription>
          </DialogHeader>
          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4 mt-2">
              <input
                type="text"
                value={waitlistName}
                onChange={(e) => setWaitlistName(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="lg" className="w-full text-base rounded-xl bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_52%)] text-white">
                Quero ser Avisado <ArrowRight size={18} />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                🔒 Sem spam. Só avisaremos quando as vagas abrirem.
              </p>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[hsl(262_83%_58%)]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-[hsl(262_83%_58%)]" />
              </div>
              <Button onClick={() => setShowWaitlist(false)} variant="outline" className="rounded-xl">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════ HERO ══════ */}
      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/3">
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center px-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[hsl(262_83%_58%)]/10 border border-[hsl(262_83%_58%)]/20 rounded-full"
            >
              <Award size={18} className="text-[hsl(262_83%_58%)]" />
              <span className="text-[hsl(262_83%_58%)] font-bold text-sm">Em breve · Vagas limitadas</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-bold mb-6 leading-[1.1]"
            >
              Domine as Redes Sociais em 30 Dias{" "}
              <span className="text-[hsl(262_83%_58%)]">(mesmo começando do zero)</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4"
            >
              Crie conteúdo que engaja, cresce e vende!
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Descubra o método exato que eu uso para transformar perfis comuns em máquinas de conteúdo. Sem enrolação, sem fórmula mágica.
            </motion.p>

            {/* Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-video bg-card border-2 border-border rounded-2xl overflow-hidden mb-8 mx-auto max-w-3xl cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={28} className="text-primary-foreground ml-1 sm:hidden" />
                  <Play size={32} className="text-primary-foreground ml-1 hidden sm:block" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-background/90 px-3 py-1 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold">Assista o vídeo de apresentação</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={openWaitlist} size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_52%)] text-white w-full sm:w-auto">
                Entrar na Lista de Espera <ArrowRight size={20} />
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-8"
            >
              <span className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-[hsl(262_83%_58%)]" /> Garantia de 30 dias
              </span>
              <span className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp size={16} className="text-[hsl(262_83%_58%)]" /> +20M de contas alcançadas
              </span>
              <span className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-[hsl(262_83%_58%)]" /> 6 anos de experiência
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ SOCIAL PROOF BAR ══════ */}
      <section className="py-6 border-y border-border bg-card/50">
        <div className="section-container">
          <p className="text-center text-sm text-muted-foreground mb-3">
            <strong className="text-foreground">Criador de conteúdo há 6 anos</strong> · TikTok, Instagram & YouTube
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs text-muted-foreground">
            <span>✔ +20M de contas alcançadas</span>
            <span>✔ 6 anos criando conteúdo</span>
            <span>✔ TikTok, Instagram & YouTube</span>
          </div>
        </div>
      </section>

      {/* ══════ LETTER ══════ */}
      <section className="py-16 sm:py-24">
        <div className="section-container max-w-3xl">
          <FadeUp>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8">Caro amigo,</h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                Se você está lendo isso, provavelmente você está <strong className="text-foreground">cansado de postar e não ter resultado</strong>.
              </p>
              
              <p>
                Eu sei como é. Há 6 anos eu estava <strong className="text-foreground">completamente perdido</strong> nas redes sociais. Postava todo dia, mas ninguém via. Não crescia. Não vendia.
              </p>
              
              <p>
                Então eu descobri que <strong className="text-foreground">o problema não era a quantidade, era a estratégia</strong>.
              </p>
              
              <p>
                Aprendi tudo na prática. Testei formatos, analisei algoritmos, estudei criadores de sucesso. E finalmente encontrei um sistema que funciona.
              </p>
              
              <p>
                Esse sistema me permitiu <strong className="text-foreground">alcançar mais de 20 milhões de contas</strong> e crescer perfis no TikTok, Instagram e YouTube. Em poucos anos, me tornei referência em criação de conteúdo.
              </p>
              
              <p className="text-foreground font-semibold">
                E agora, eu vou colocar tudo isso em um curso.
              </p>
              
              <p>
                <strong className="text-foreground">Nada de teoria chata. Nada de complicação.</strong> Só o que realmente funciona, do jeito mais simples possível.
              </p>
              
              <p>
                Você vai aprender exatamente o que eu aplico no meu dia a dia, as mesmas estratégias que me levaram a alcançar milhões de pessoas organicamente.
              </p>
              
              <p className="text-foreground font-semibold">
                Você paga uma única vez e tem acesso para sempre.
              </p>
              
              <p>
                Não espere estar "pronto". Não espere ter mais seguidores. Comece agora. Eu te mostro o caminho.
              </p>
              
              <p className="mt-8">
                Um abraço,<br />
                <strong className="text-foreground text-lg">Quinzinho Oliveira</strong><br />
                <span className="text-sm">Criador de Conteúdo & Especialista em Crescimento Orgânico</span>
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-12 text-center">
            <Button onClick={openWaitlist} size="lg" className="text-base sm:text-lg px-8 py-5 sm:py-6 rounded-xl bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_52%)] text-white w-full sm:w-auto">
              Entrar na Lista de Espera <ArrowRight size={20} />
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* ══════ WHAT YOU'LL LEARN ══════ */}
      <section className="py-16 sm:py-24">
        <div className="section-container">
          <FadeUp>
            <span className="text-[hsl(262_83%_58%)] font-heading font-bold text-sm uppercase tracking-[0.2em] mb-4 block text-center">
              Conteúdo do Curso
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
              O que você vai aprender
            </h2>
            <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
              4 módulos práticos + bônus exclusivos. Você implementa enquanto aprende.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {modules.map((module, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 sm:p-8 bg-card border border-border rounded-2xl"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[hsl(262_83%_58%)]/10 flex items-center justify-center mb-4 sm:mb-5">
                    <module.icon size={24} className="text-[hsl(262_83%_58%)]" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 sm:mb-4">{module.title}</h3>
                  <ul className="space-y-3">
                    {module.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 size={18} className="text-[hsl(262_83%_58%)] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ BONUSES ══════ */}
      <section className="py-16 sm:py-24 bg-secondary/50">
        <div className="section-container max-w-4xl">
          <FadeUp>
            <span className="text-[hsl(262_83%_58%)] font-heading font-bold text-sm uppercase tracking-[0.2em] mb-4 block text-center">
              Bônus Exclusivos
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-14 text-center">
              Quando você se inscrever, você também recebe:
            </h2>
          </FadeUp>

          <div className="space-y-4">
            {bonuses.map((bonus, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="p-5 sm:p-6 bg-card border border-border rounded-xl flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[hsl(262_83%_58%)]/10 flex items-center justify-center shrink-0">
                    <bonus.icon size={24} className="text-[hsl(262_83%_58%)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold mb-1">{bonus.title}</h3>
                    <p className="text-sm text-muted-foreground">{bonus.desc}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs text-muted-foreground line-through">{bonus.value}</p>
                    <p className="text-sm font-bold text-[hsl(262_83%_58%)]">GRÁTIS</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4} className="mt-12 text-center">
            <Button onClick={openWaitlist} size="lg" className="text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 rounded-xl w-full max-w-md bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_52%)] text-white">
              Garantir Minha Vaga na Lista <ArrowRight size={20} />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              🔔 Seja avisado primeiro quando as inscrições abrirem
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ══════ GUARANTEE ══════ */}
      <section className="py-16 sm:py-24">
        <div className="section-container max-w-3xl">
          <FadeUp>
            <div className="bg-card border-2 border-[hsl(262_83%_58%)]/30 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[hsl(262_83%_58%)]/10 flex items-center justify-center mx-auto mb-6">
                <Shield size={36} className="text-[hsl(262_83%_58%)]" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                Garantia Incondicional de 30 Dias
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                Se você assistir o curso, aplicar o método e não ver <strong className="text-foreground">crescimento real nas suas redes sociais em 30 dias</strong>, eu devolvo 100% do seu dinheiro.
              </p>
              <p className="text-foreground font-semibold text-sm sm:text-base">
                Sem perguntas. Sem burocracia. É só me enviar um email.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="py-16 sm:py-24 bg-secondary/50">
        <div className="section-container max-w-3xl">
          <FadeUp>
            <span className="text-[hsl(262_83%_58%)] font-heading font-bold text-sm uppercase tracking-[0.2em] mb-4 block text-center">
              Dúvidas Frequentes
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-14 text-center">
              Perguntas & Respostas
            </h2>
          </FadeUp>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <details className="group bg-card border border-border rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer font-heading font-bold text-sm sm:text-base hover:text-[hsl(262_83%_58%)] transition-colors">
                    {faq.q}
                    <ArrowRight size={16} className="text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.a}</div>
                </details>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-10 sm:py-14">
        <div className="section-container text-center">
          <p className="text-muted-foreground text-sm mb-4">Acompanhe nas redes</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="https://www.instagram.com/oliveirasocial_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full hover:border-[hsl(262_83%_58%)]/30 transition-colors text-sm font-medium">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@quinzinhooliveira_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full hover:border-[hsl(262_83%_58%)]/30 transition-colors text-sm font-medium">
              TikTok
            </a>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(262_83%_58%)]/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[hsl(262_83%_58%)]/5 rounded-full blur-[120px]" />
        
        <div className="section-container text-center max-w-2xl relative z-10 px-6">
          <FadeUp>
            <div className="mb-8">
              <Sparkles size={40} className="text-[hsl(262_83%_58%)] mx-auto mb-4 sm:w-12 sm:h-12" />
              <span className="text-[hsl(262_83%_58%)] font-heading font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                Em Breve
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
              Não fique de fora quando as vagas abrirem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-10">
              Entre na lista de espera e seja o primeiro a garantir sua vaga, com condições exclusivas de lançamento.
            </p>
            <Button onClick={openWaitlist} size="lg" className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 rounded-xl mb-4 bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_52%)] text-white w-full sm:w-auto">
              Entrar na Lista de Espera <ArrowRight size={24} />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              🔔 Vagas limitadas • 🔒 Sem spam • ✨ Condição especial para a lista
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};

export default Curso;
