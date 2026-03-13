import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Instagram, Youtube, Linkedin, Music } from "lucide-react";
import { Helmet } from "react-helmet-async";
import sobrePhoto2 from "@/assets/quinzinho-sobre-2.jpeg";
import sobreInfancia from "@/assets/sobre-infancia.jpeg";
import sobreDesenhos from "@/assets/sobre-desenhos.jpeg";
import sobreLivro from "@/assets/sobre-livro.jpeg";
import sobreGaleria from "@/assets/sobre-galeria.jpeg";
import sobreGaleria2 from "@/assets/sobre-galeria2.jpeg";
import sobreCrianca from "@/assets/sobre-crianca.jpeg";

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

const timeline = [
  {
    year: "Infância",
    title: "Tudo começou com um lápis",
    text: "Quando era criança, passava horas desenhando personagens e cenários. Ainda não sabia, mas já estava treinando a habilidade que mais ia importar: criar coisas do zero.",
    image: sobreInfancia,
  },
  {
    year: "Adolescência",
    title: "A música tomou conta",
    text: "Virei DJ, comecei a produzir beats, remixes. A música foi a primeira coisa que me fez sentir que eu podia construir algo que as pessoas sentissem. Depois veio a dança, a fotografia, a edição de vídeo. Cada fase parecia diferente, mas no fundo era o mesmo impulso.",
    image: sobreDesenhos,
  },
  {
    year: "A virada",
    title: "Do criar ao construir",
    text: "Comecei a estudar finanças, marketing, negócios. Percebi que toda aquela energia criativa podia virar algo maior. Escrevi meu primeiro livro, 'A Casa dos 20', que vendeu mais de 5.000 cópias. Não foi sorte. Foi obsessão por um projeto que eu acreditava.",
    image: sobreLivro,
  },
  {
    year: "Hoje",
    title: "Vários projetos, um propósito",
    text: "Consultoria financeira, uma agência de comércio exterior, criação de conteúdo, uma marca de roupas e uma comunidade focada em autodesenvolvimento. Não sigo um caminho linear. Nunca segui. O que me guia é a vontade de construir coisas que façam sentido e que possam ajudar outras pessoas.",
    image: sobreGaleria,
  },
];

const Sobre = () => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <Helmet>
        <title>Sobre Mim | Quinzinho Oliveira</title>
        <meta name="description" content="Conheça a história do Quinzinho Oliveira. De DJ e produtor musical a empreendedor, autor e criador de conteúdo." />
      </Helmet>

      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden" style={{ backgroundColor: 'hsl(0, 0%, 7%)', color: 'hsl(0, 0%, 95%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative z-10 section-container">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-primary font-medium uppercase tracking-widest text-sm mb-4"
              >
                Sobre mim
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Eu sou o Quinzinho.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[hsl(0,0%,55%)] text-lg leading-relaxed max-w-xl"
              >
                Tenho 24 anos e desde sempre fui movido por criar coisas. Não importa o formato. O que me motiva é tirar algo da cabeça e colocar no mundo.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="md:col-span-2 flex justify-center"
            >
              <img src={sobrePhoto2} alt="Quinzinho Oliveira" className="w-64 sm:w-80 rounded-2xl shadow-2xl object-cover aspect-[3/4]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline / Storytelling */}
      <section className="py-20 sm:py-28">
        <div className="section-container max-w-5xl">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16 text-center">A trajetória</h2>
          </FadeUp>

          <div className="space-y-20 sm:space-y-28">
            {timeline.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <FadeUp key={item.year} delay={0.1}>
                  <div className={`grid md:grid-cols-2 gap-8 sm:gap-12 items-center ${!isEven ? "md:direction-rtl" : ""}`}>
                    <div className={`${!isEven ? "md:order-2" : ""}`}>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        {item.year}
                      </span>
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                    <div className={`${!isEven ? "md:order-1" : ""} flex justify-center`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full max-w-sm rounded-2xl shadow-xl object-cover aspect-[4/5]"
                      />
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote */}
      <FadeUp>
        <section className="py-16 sm:py-20" style={{ backgroundColor: 'hsl(0, 0%, 5%)' }}>
          <div className="section-container max-w-3xl text-center">
            <blockquote className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-[hsl(0,0%,90%)]">
              "O que me guia não é um plano perfeito.<br />É a vontade de construir."
            </blockquote>
          </div>
        </section>
      </FadeUp>

      {/* What I do */}
      <FadeUp>
        <section className="py-16 sm:py-24 bg-secondary/30">
          <div className="section-container max-w-4xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-10 text-center">O que faço hoje</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Consultoria Financeira", desc: "Ajudo pessoas a organizarem suas finanças e planejarem o futuro.", link: "/consultoria" },
                { title: "Criação de Conteúdo", desc: "YouTube, Instagram, TikTok e Blog. Cada plataforma com um propósito.", link: "/conteudo" },
                { title: "Olivar Global", desc: "Agência de comércio exterior conectando Brasil e mercado internacional.", link: "/olivar-global" },
                { title: "OLSPROJECT", desc: "Comunidade focada em autodesenvolvimento pessoal e profissional.", link: "/olsproject" },
              ].map((item) => (
                <div key={item.title} className="p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <h3 className="font-heading font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.desc}</p>
                  {item.link && (
                    <Link to={item.link} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:opacity-80 transition-opacity">
                      Ver mais <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Gallery strip */}
      <FadeUp>
        <section className="py-12 overflow-hidden">
          <div className="flex gap-4 animate-none">
            <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
              {[
                { src: sobreGaleria2, pos: "object-center" },
                { src: sobreLivro, pos: "object-center" },
                { src: sobreGaleria, pos: "object-top" },
                { src: sobreCrianca, pos: "object-center" },
              ].map((item, i) => (
                <img key={i} src={item.src} alt="" className={`w-full aspect-square object-cover rounded-xl grayscale ${item.pos}`} />
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Social + CTA */}
      <FadeUp>
        <section className="py-16 sm:py-20">
          <div className="section-container text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Vamos nos conectar</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Me acompanha nas redes ou entra em contato direto.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              {[
                { icon: Youtube, href: "https://www.youtube.com/@quinzinhooliveira", label: "YouTube" },
                { icon: Instagram, href: "https://www.instagram.com/quinzinhooliveiraa_/", label: "Instagram" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/joaquim-emmanuel-oliveira/", label: "LinkedIn" },
                { icon: Music, href: "https://www.tiktok.com/@quinzinhooliveiraa_", label: "TikTok" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-border bg-card flex items-center justify-center text-foreground transition-colors hover:text-primary hover:border-primary hover:bg-primary/10"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] uppercase tracking-wide text-sm"
            >
              Entrar em Contato <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </FadeUp>
    </div>
  );
};

export default Sobre;
