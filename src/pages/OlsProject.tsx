import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Users, Target, Compass, Lightbulb, Heart, Brain,
  Briefcase, Dumbbell, MessageCircle, Shield, Sparkles, Star, CheckCircle2,
  Instagram, Music, Youtube
} from "lucide-react";

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

const areas = [
  { icon: Brain, label: "Mentalidade", desc: "Desenvolva uma forma de pensar que te leve mais longe." },
  { icon: Briefcase, label: "Carreira", desc: "Currículo, posicionamento, transição profissional." },
  { icon: Heart, label: "Bem-estar", desc: "Saúde mental, rotina, equilíbrio emocional." },
  { icon: Dumbbell, label: "Saúde física", desc: "Alimentação, treino, disciplina corporal." },
  { icon: Lightbulb, label: "Habilidades", desc: "Comunicação, oratória, dicção, liderança." },
  { icon: Target, label: "Finanças", desc: "Organização financeira, investimentos, independência." },
];

const pilares = [
  {
    icon: Users,
    title: "Comunidade real",
    desc: "Um espaço onde você encontra pessoas com os mesmos objetivos. Não seguidores. Pessoas que te puxam pra cima e cobram resultado.",
  },
  {
    icon: Compass,
    title: "Mentores especializados",
    desc: "Dentro da plataforma, você acessa profissionais de cada área: finanças, comunicação, nutrição, carreira. A pessoa certa pro que você precisa desenvolver.",
  },
  {
    icon: Sparkles,
    title: "Desafios que transformam",
    desc: "Nada de conteúdo passivo. Aqui você é desafiado a agir. Metas semanais, accountability e acompanhamento real do seu progresso.",
  },
];

const OlsProject = () => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <Helmet>
        <title>OLSPROJECT | Comunidade de Desenvolvimento Pessoal e Profissional</title>
        <meta name="description" content="OLSPROJECT é uma comunidade focada em conectar pessoas que querem crescer. Mentores, desafios e uma rede de apoio para desenvolvimento pessoal e profissional." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 3%)', color: 'hsl(0, 0%, 95%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(0_0%_20%_/_0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,hsl(0_0%_15%_/_0.2),transparent_50%)]" />

        <div className="relative z-10 section-container w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(0_0%_100%_/_0.08)] border border-[hsl(0_0%_100%_/_0.15)] rounded-full mb-8"
            >
              <Star size={14} className="text-[hsl(0,0%,95%)]" />
              <span className="text-sm font-medium text-[hsl(0,0%,85%)]">Em construção</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-heading text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] mb-6 tracking-tight text-white"
            >
              OLSPROJECT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl text-[hsl(0,0%,60%)] mb-4 max-w-xl leading-relaxed"
            >
              O lugar onde você vai pra crescer.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[hsl(0,0%,45%)] text-base sm:text-lg mb-10 max-w-lg"
            >
              Uma comunidade que conecta pessoas comprometidas com o desenvolvimento pessoal e profissional a mentores especializados em cada área da vida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/contato"
                className="px-8 py-3.5 bg-white text-black font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
              >
                Quero saber quando lançar
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <FadeUp>
        <section className="py-20 sm:py-28" style={{ backgroundColor: 'hsl(0, 0%, 2%)' }}>
          <div className="section-container max-w-3xl text-center">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-[hsl(0,0%,92%)]">
              Nasceu de uma vontade simples
            </h2>
            <div className="space-y-6 text-[hsl(0,0%,55%)] text-lg leading-relaxed">
              <p>
                Eu sempre quis criar um lugar onde as pessoas pudessem ir pra crescer de verdade. Não um curso. Não um perfil de dicas. Um lugar.
              </p>
              <p>
                Um espaço onde você encontra pessoas que pensam como você, que têm os mesmos objetivos, e que te cobram resultado. Onde você é desafiado a ser melhor toda semana.
              </p>
              <p className="text-white font-medium text-xl">
                O OLSPROJECT é isso: uma comunidade que te força a evoluir.
              </p>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* 3 Pilares */}
      <section className="py-20 sm:py-28">
        <div className="section-container max-w-5xl">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-center">Como funciona</h2>
            <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              Três pilares que sustentam tudo.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {pilares.map((pilar, i) => (
              <FadeUp key={pilar.title} delay={i * 0.12}>
                <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-[hsl(0,0%,40%)] transition-colors group h-full">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(0_0%_100%_/_0.05)] flex items-center justify-center mb-6 group-hover:bg-[hsl(0_0%_100%_/_0.08)] transition-colors">
                    <pilar.icon size={28} className="text-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">{pilar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pilar.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <FadeUp>
        <section className="py-20 sm:py-28 bg-secondary/30">
          <div className="section-container max-w-5xl">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-center">Áreas de desenvolvimento</h2>
            <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
              Dentro do OLSPROJECT, você encontra apoio pra qualquer área da vida que queira desenvolver.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {areas.map((area, i) => (
                <motion.div
                  key={area.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-[hsl(0_0%_100%_/_0.05)] flex items-center justify-center flex-shrink-0">
                    <area.icon size={20} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{area.label}</h3>
                    <p className="text-muted-foreground text-sm">{area.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Mentors vision */}
      <section className="py-20 sm:py-28">
        <div className="section-container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                  Um mentor pra<br />cada área da vida
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A ideia é simples: juntar profissionais de todas as áreas numa só plataforma. Se você quer melhorar sua dicção, tem alguém pra isso. Se quer organizar suas finanças, também. Currículo, alimentação, treino, mentalidade.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Não é sobre seguir um guru. É sobre ter acesso à pessoa certa, no momento certo, pro que você precisa desenvolver.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="space-y-4">
                {[
                  "Mentores verificados em cada especialidade",
                  "Sessões individuais ou em grupo",
                  "Planos de desenvolvimento personalizados",
                  "Acompanhamento real de progresso",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
                    <CheckCircle2 size={18} className="text-foreground flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Quote */}
      <FadeUp>
        <section className="py-16 sm:py-20" style={{ backgroundColor: 'hsl(0, 0%, 3%)' }}>
          <div className="section-container max-w-3xl text-center">
            <blockquote className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-white">
              "O objetivo é ser o lugar onde<br />a pessoa vai pra crescer."
            </blockquote>
            <p className="text-[hsl(0,0%,45%)] mt-4">Quinzinho Oliveira</p>
          </div>
        </section>
      </FadeUp>

      {/* Social */}
      <FadeUp>
        <section className="py-16 sm:py-20 bg-secondary/30">
          <div className="section-container max-w-3xl text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Acompanhe o OLSPROJECT</h2>
            <p className="text-muted-foreground mb-8">O projeto já existe nas redes. Acompanha de perto.</p>
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <a
                href="https://www.instagram.com/olsproject"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full hover:border-primary transition-colors"
              >
                <Instagram size={20} />
                <span className="font-medium text-sm">Instagram</span>
              </a>
              <a
                href="http://www.youtube.com/@OLSPROJECT_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full hover:border-primary transition-colors"
              >
                <Youtube size={20} />
                <span className="font-medium text-sm">YouTube</span>
              </a>
              <a
                href="https://www.tiktok.com/@olsproject"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full hover:border-primary transition-colors"
              >
                <Music size={20} />
                <span className="font-medium text-sm">TikTok</span>
              </a>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* CTA */}
      <FadeUp>
        <section className="py-20 sm:py-28">
          <div className="section-container text-center">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Quer ser o primeiro a entrar?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
              O OLSPROJECT ainda está em construção, mas você pode garantir seu lugar desde já.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
            >
              Entrar em contato <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </FadeUp>
    </div>
  );
};

export default OlsProject;
