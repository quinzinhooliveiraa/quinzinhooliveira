import { Link } from "react-router-dom";
import { ArrowRight, Code, Globe, Smartphone, Zap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: Globe, title: "Landing Pages", desc: "Páginas de alta conversão para seu produto ou serviço." },
  { icon: Code, title: "Sites Institucionais", desc: "Presença digital profissional com design moderno." },
  { icon: Smartphone, title: "Aplicativos Web", desc: "Apps responsivos e interativos com tecnologia de ponta." },
  { icon: Zap, title: "Automações com IA", desc: "Integração de inteligência artificial no seu fluxo de trabalho." },
];

const benefits = [
  "Desenvolvimento rápido com Vibe Coding",
  "Design moderno e responsivo",
  "Otimizado para SEO e performance",
  "Integração com APIs e serviços externos",
  "Suporte e manutenção contínua",
  "Tecnologias de última geração",
];

const VibeCoding = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 7%)', color: 'hsl(0, 0%, 95%)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Serviço
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Vibe <span className="text-primary">Coding</span>
          </h1>
          <p className="text-lg text-[hsl(0,0%,55%)] mb-8 max-w-lg">
            Criação de sites, landing pages e aplicativos usando inteligência artificial e as tecnologias mais modernas do mercado. Rápido, bonito e funcional.
          </p>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
          >
            Solicitar Orçamento <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Services Grid */}
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-12">O que eu crio</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
            >
              <s.icon className="text-primary mb-4" size={32} />
              <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-10">Por que Vibe Coding?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="text-primary flex-shrink-0" size={20} />
                <span className="text-sm sm:text-base">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 sm:py-20">
      <div className="section-container text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Pronto para criar?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Entre em contato e vamos transformar sua ideia em realidade digital.
        </p>
        <Link
          to="/contato"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
        >
          Falar Comigo <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </div>
);

export default VibeCoding;
