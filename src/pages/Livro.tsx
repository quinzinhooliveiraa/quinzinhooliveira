import { useRef } from "react";
import { Check, Star, ArrowRight, ShoppingCart, Smartphone, ExternalLink, Instagram } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";
import bookImg from "@/assets/book-cover-new.png";
import bookPhysical from "@/assets/book-physical.png";
import bookDigital from "@/assets/book-digital.png";
import badgeBestseller from "@/assets/badge-bestseller.png";
import logoAmazon from "@/assets/logo-amazon.png";
import logoAppleBooks from "@/assets/logo-applebooks.png";
import logoMagalu from "@/assets/logo-magalu.png";
import logoAmericanas from "@/assets/logo-americanas.png";
import logoClubeAutores from "@/assets/logo-clubeautores.png";
import appScreenHome from "@/assets/app-screen-home.jpeg";
import appScreenCards from "@/assets/app-screen-cards.jpeg";
import appScreenJornada from "@/assets/app-screen-jornada.jpeg";

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const painPoints = [
  "Sente que todo mundo sabe o que fazer, menos você?",
  "Se compara com quem aparece nas redes sociais e se sente para trás?",
  "Tem medo de estar tomando as decisões erradas?",
  "Parece que a vida adulta chegou e ninguém te deu um manual?",
];

const topics = ["Propósito", "Relacionamentos", "Identidade", "Redes Sociais", "Carreira", "Ansiedade da vida adulta"];

const benefits = [
  "Parar de se comparar com os outros e viver no seu tempo",
  "Tomar decisões com mais clareza e menos medo",
  "Encontrar paz no meio da incerteza dos seus 20",
  "Sentir que alguém realmente te entende, porque entende",
];

const defaultStores = [
  { name: "Amazon", settingKey: "livro_store_amazon", url: "https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/", logo: logoAmazon },
  { name: "Apple Books", settingKey: "livro_store_applebooks", url: "https://books.apple.com/us/book/a-casa-dos-20/id6760140786", logo: logoAppleBooks },
  { name: "Magazine Luiza", settingKey: "livro_store_magalu", url: "https://www.magazineluiza.com.br/a-casa-dos-20-refletindo-sobre-os-desafios-da-transicao-para-a-vida-adulta-clube-de-autores/p/hb991841h6/li/best/", logo: logoMagalu },
  { name: "Americanas", settingKey: "livro_store_americanas", url: "https://www.americanas.com.br", logo: logoAmericanas },
  { name: "Clube de Autores", settingKey: "livro_store_clubeautores", url: "https://clubedeautores.pt/livro/a-casa-dos", logo: logoClubeAutores },
];

const realReviews = [
  { name: "Joice Coutinho", source: "Skoob", rating: 5, text: "Comecei esse livro para passar o tempo e me surpreendi. Parece que estou lendo uma mensagem de algum amigo, com bons conselhos e empatia. Escrita leve e fluída!" },
  { name: "Maria Eduarda", source: "Amazon", rating: 5, text: "Este livro é maravilhoso!! Todos devem ter a oportunidade de ler algo tão reconfortante e especial. Neste momento difícil dos nossos 20 anos… ficará em meu coração!" },
  { name: "Cliente Kindle", source: "Amazon", rating: 5, text: "Eu não sei nem expressar o que senti lendo. É a sensação de ser compreendida. Cada capítulo me faz sair da bolha e enxergar outro ponto de vista." },
  { name: "Arthur Rocha", source: "Amazon", rating: 5, text: "Muito bom esse livro, você se sente leve e como se tivesse desabafando com alguém que te entende de verdade." },
  { name: "Cliente Kindle", source: "Amazon", rating: 5, text: "Estou prestes a completar 19 anos e estava insegura com muitas coisas. Foi perfeito para mim! Te leva a pensar mais nas suas ações." },
  { name: "Leitor(a)", source: "Amazon", rating: 5, text: "Indiquei a todas as pessoas que pude. É certeiro em falar sobre os sentimentos dessa transição. Sinto que todos nessa casa dos 20 precisam ler." },
];

const BuyButton = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${className}`}>
    <AdminEditableLink
      settingKey="livro_buy_url"
      defaultHref="https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/"
      external
      className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg transition-all hover:opacity-90 hover:scale-[1.02] text-base sm:text-lg"
    >
      <ShoppingCart size={20} /> Comprar Agora
    </AdminEditableLink>
    <a
      href="#onde-encontrar"
      className="px-6 py-3 sm:py-4 border border-border text-foreground font-medium rounded-lg transition-colors hover:border-primary hover:text-primary text-center"
    >
      Ver Todas as Lojas
    </a>
  </div>
);

const Livro = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="py-16 sm:py-20 md:py-28">
      <div className="section-container grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <FadeUp>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="category-badge text-xs">#1 Best-seller Amazon por 2 meses</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              A Casa dos 20
            </h1>
            <p className="text-lg sm:text-xl text-foreground mb-2 leading-relaxed font-medium">
              "Parece que estou lendo uma mensagem de um amigo."
            </p>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              O livro que já ajudou <strong className="text-foreground">mais de 5.000 jovens</strong> a encontrar clareza na fase mais confusa da vida. 83 reflexões sobre propósito, identidade e os desafios reais dos seus 20 anos.
            </p>

            <div className="flex flex-wrap gap-6 sm:gap-8 mb-8 py-4 border-t border-b border-border">
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">5.000+</p>
                <p className="text-xs text-muted-foreground">Cópias vendidas</p>
              </div>
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">4,6 ★</p>
                <p className="text-xs text-muted-foreground">Amazon (231)</p>
              </div>
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">2 meses</p>
                <p className="text-xs text-muted-foreground">#1 Amazon</p>
              </div>
            </div>

            <BuyButton />
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="flex justify-center relative order-first md:order-last">
            <img src={badgeBestseller} alt="#1 Best Seller" className="absolute -top-4 -right-2 md:right-4 w-16 sm:w-20 md:w-24 z-10" />
            <img src={bookImg} alt="A Casa dos 20 - Livro" className="w-60 sm:w-72 md:w-80 lg:w-96 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />
          </div>
        </FadeUp>
      </div>
    </section>

    {/* Featured review */}
    <FadeUp>
      <section className="py-8 sm:py-10 border-t border-b border-border">
        <div className="section-container max-w-4xl text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="text-lg sm:text-xl md:text-2xl italic text-foreground font-medium leading-relaxed mb-3">
            "Eu não sei nem expressar o que senti lendo esse livro. É a sensação de ser compreendida. Cada capítulo me faz sair da bolha."
          </blockquote>
          <p className="text-sm text-muted-foreground">Cliente Kindle, Amazon • Compra verificada</p>
        </div>
      </section>
    </FadeUp>

    {/* Pain points */}
    <section className="py-16 sm:py-20 bg-secondary/50">
      <div className="section-container max-w-3xl">
        <FadeUp>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
            Se você está na casa dos 20...
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-base">
            Provavelmente já se perguntou pelo menos uma dessas coisas:
          </p>
        </FadeUp>
        <ul className="space-y-4 sm:space-y-5">
          {painPoints.map((p, i) => (
            <FadeUp key={p} delay={i * 0.08}>
              <li className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg">
                <span className="mt-1 text-primary text-xl sm:text-2xl">→</span>
                <span className="text-foreground font-medium">{p}</span>
              </li>
            </FadeUp>
          ))}
        </ul>
        <FadeUp delay={0.4}>
          <p className="mt-8 sm:mt-10 text-center text-lg sm:text-xl font-medium text-foreground">
            Você não está sozinho. Este livro foi escrito pra você.
          </p>
          <div className="mt-8 flex justify-center">
            <BuyButton />
          </div>
        </FadeUp>
      </div>
    </section>

    {/* What's inside */}
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <FadeUp>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                83 reflexões que vão mudar sua perspectiva.
              </h2>
              <p className="text-muted-foreground mb-4 text-base sm:text-lg">
                Cada capítulo é como uma conversa sincera com um amigo que já passou pelo que você está passando.
              </p>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Sem teoria chata. Sem clichê. Apenas honestidade sobre propósito, relacionamentos, redes sociais e o medo de não saber o que fazer da vida.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8">
                {topics.map((t) => (
                  <div key={t} className="p-3 sm:p-4 bg-card border border-border rounded-xl text-center font-heading font-medium text-sm sm:text-base">
                    {t}
                  </div>
                ))}
              </div>
              <a
                href="https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity"
              >
                Quero ler agora <ArrowRight size={16} />
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex justify-center">
              <img src={bookPhysical} alt="A Casa dos 20 - Edição Física" className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl" />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* Social proof mini */}
    <FadeUp>
      <section className="py-10 sm:py-12 bg-secondary/50">
        <div className="section-container max-w-4xl text-center">
          <blockquote className="text-base sm:text-lg italic text-foreground mb-3">
            "Este livro é maravilhoso!! Todos devem ter a oportunidade de ler algo tão reconfortante e especial."
          </blockquote>
          <p className="text-sm text-muted-foreground">Maria Eduarda, Amazon • 5 estrelas</p>
        </div>
      </section>
    </FadeUp>

    {/* Transformation */}
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <FadeUp className="order-2 md:order-1">
            <div className="flex justify-center">
              <img src={bookDigital} alt="A Casa dos 20 - Edição Digital" className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl" />
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="order-1 md:order-2">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Depois de ler, você vai:
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Não é mágica. É clareza. É saber que você não precisa ter tudo resolvido agora e que isso é completamente normal.
              </p>
              <ul className="space-y-4 sm:space-y-5 mb-8">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-base sm:text-lg">{b}</span>
                  </li>
                ))}
              </ul>
              <BuyButton />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* Editions */}
    <section className="py-16 sm:py-20 bg-secondary/50">
      <div className="section-container">
        <FadeUp>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
            Escolha a sua edição
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-base">
            Disponível em formato físico e digital, para ler onde e quando quiser.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {[
            { img: bookPhysical, title: "Edição Física", desc: "176 páginas • Capa Comum • Entrega em todo Brasil", url: "https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/", label: "Comprar Físico" },
            { img: bookDigital, title: "Edição Digital", desc: "eBook • Leia em qualquer dispositivo • Acesso imediato", url: "https://books.apple.com/us/book/a-casa-dos-20/id6760140786", label: "Comprar Digital" },
          ].map((ed, i) => (
            <FadeUp key={ed.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-6 sm:p-8 bg-card border border-border rounded-xl text-center transition-all hover:border-primary hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <img src={ed.img} alt={ed.title} className="w-40 sm:w-52 mx-auto mb-6 rounded-lg" />
                <h3 className="font-heading text-lg sm:text-xl font-bold mb-2">{ed.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">{ed.desc}</p>
                <a
                  href={ed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg text-sm transition-all hover:opacity-90"
                >
                  {ed.label} <ArrowRight size={16} />
                </a>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* Reviews */}
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <FadeUp>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">
            +231 avaliações com nota 4,6 ★
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-sm sm:text-base">
            Veja o que leitores reais dizem sobre o livro.
          </p>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {realReviews.map((r, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-5 sm:p-6 bg-card border border-border rounded-xl transition-all hover:border-primary/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {r.source}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground italic mb-3">"{r.text}"</p>
                <p className="text-xs font-medium text-foreground">{r.name}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a
            href="https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/#customerReviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary font-medium hover:opacity-80 transition-opacity"
          >
            Ver todas as avaliações na Amazon →
          </a>
        </div>
        <div className="mt-8 flex justify-center">
          <BuyButton />
        </div>
      </div>
    </section>

    {/* Where to buy */}
    <FadeUp>
      <section id="onde-encontrar" className="py-12 sm:py-16 bg-secondary/50">
        <div className="section-container">
          <p className="text-center text-sm text-muted-foreground mb-6 sm:mb-8 uppercase tracking-widest font-medium">
            Disponível em
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10 max-w-4xl mx-auto">
            {stores.map((store) => (
              <a
                key={store.name}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105"
              >
                <img src={store.logo} alt={store.name} className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-lg" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </FadeUp>

    {/* App CTA */}
    <section className="py-16 sm:py-24 bg-secondary/50">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <FadeUp>
            <div>
              <span className="category-badge text-xs mb-4 inline-block">Novo</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                O livro ganhou um app.
              </h2>
              <p className="text-muted-foreground mb-4 text-base sm:text-lg">
                Evolução de verdade acontece quando você pratica, não só quando lê. O app Casa dos 20 transforma cada reflexão em ação.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Jornadas de 30 dias com atividades práticas",
                  "Perguntas profundas para autoconhecimento",
                  "Diário pessoal para registrar sua evolução",
                  "Check-in de humor e relatório mensal",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-foreground text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://adulting-quinzinho-y49vdv48vx.replit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg transition-all hover:opacity-90 hover:scale-[1.02] text-base sm:text-lg mb-4"
              >
                <Smartphone size={20} /> Acessar o App (Web)
              </a>

              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg opacity-60">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div>
                    <p className="text-[10px] text-muted-foreground leading-none">Em breve na</p>
                    <p className="text-xs font-bold text-foreground leading-tight">App Store</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg opacity-60">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground"><path d="M3.18 23.73L14.45 12.46 3.18.27a1.06 1.06 0 0 0-.26.72v22.02c0 .27.1.52.26.72zm1.47 1.01l12.83-7.39-2.83-2.83L4.65 24.74zm15.23-8.76l-3.07-1.77-3.12 3.12 3.12 3.12 3.07-1.77c.87-.5.87-1.78 0-2.7zm-15.23-15L16.95 8.37l2.83-2.83L4.65-.99z"/></svg>
                  <div>
                    <p className="text-[10px] text-muted-foreground leading-none">Em breve no</p>
                    <p className="text-xs font-bold text-foreground leading-tight">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex justify-center gap-3 sm:gap-4">
              <div className="w-36 sm:w-44 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-border/30">
                <img src={appScreenHome} alt="Casa dos 20 App - Tela inicial" className="w-full h-auto" />
              </div>
              <div className="w-36 sm:w-44 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-border/30 mt-8">
                <img src={appScreenCards} alt="Casa dos 20 App - Perguntas" className="w-full h-auto" />
              </div>
              <div className="w-36 sm:w-44 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-border/30 hidden sm:block mt-4">
                <img src={appScreenJornada} alt="Casa dos 20 App - Jornada" className="w-full h-auto" />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* Social Links */}
    <section className="py-10 sm:py-14">
      <div className="section-container text-center">
        <p className="text-muted-foreground text-sm mb-4">Acompanhe o livro nas redes</p>
        <div className="flex justify-center gap-4">
          <a href="https://www.instagram.com/quinzinhooliveira_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full hover:border-primary/30 transition-colors text-sm font-medium">
            <Instagram size={16} className="text-primary" /> Instagram
          </a>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-16 sm:py-24">
      <div className="section-container text-center max-w-2xl">
        <FadeUp>
          <img src={badgeBestseller} alt="#1 Best Seller" className="w-14 sm:w-16 mx-auto mb-6" />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            A clareza que você precisa está a uma leitura de distância.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Mais de 5.000 jovens já decidiram parar de se sentir perdidos.
          </p>
          <p className="text-lg sm:text-xl font-medium text-foreground mb-8">
            Você vai ser o próximo?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.amazon.com.br/Casa-dos-20-Quinzinho-Oliveira/dp/B0CWW9JR92/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg transition-all hover:opacity-90 hover:scale-[1.02] text-base sm:text-lg"
            >
              <ShoppingCart size={20} /> Quero Minha Cópia
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Amazon • Apple Books • Magazine Luiza • Mercado Livre • Americanas • Clube de Autores
          </p>
        </FadeUp>
      </div>
    </section>
  </div>
);

export default Livro;
