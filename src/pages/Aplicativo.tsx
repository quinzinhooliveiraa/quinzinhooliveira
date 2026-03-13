import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Layers, Shield, Rocket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Smartphone, title: "Apps Multiplataforma", desc: "Android e iOS com uma única base de código." },
  { icon: Layers, title: "UI/UX Premium", desc: "Design intuitivo e experiência do usuário impecável." },
  { icon: Shield, title: "Segurança", desc: "Proteção de dados e autenticação robusta." },
  { icon: Rocket, title: "Performance", desc: "Apps rápidos, leves e otimizados." },
];

const process = [
  { step: "01", title: "Descoberta", desc: "Entendo sua ideia, público e objetivos." },
  { step: "02", title: "Design", desc: "Crio protótipos e valido a experiência do usuário." },
  { step: "03", title: "Desenvolvimento", desc: "Construo o app com tecnologia moderna e IA." },
  { step: "04", title: "Lançamento", desc: "Publico nas lojas e garanto suporte contínuo." },
];

const Aplicativo = () => (
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
            Desenvolvimento de <span className="text-primary">Aplicativos</span>
          </h1>
          <p className="text-lg text-[hsl(0,0%,55%)] mb-8 max-w-lg">
            Transformo sua ideia em um aplicativo funcional, bonito e escalável. Do conceito ao lançamento nas lojas.
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

    {/* Features */}
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-12">Diferenciais</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
            >
              <f.icon className="text-primary mb-4" size={32} />
              <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="section-container">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-12">Como funciona</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="text-center"
            >
              <span className="inline-block font-heading text-4xl font-bold text-primary mb-3">{p.step}</span>
              <h3 className="font-heading font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 sm:py-20">
      <div className="section-container text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Tem uma ideia de app?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Vamos conversar e transformar seu conceito em um produto real.
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

export default Aplicativo;
