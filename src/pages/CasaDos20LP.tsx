import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  BookOpen, Brain, Smartphone, Heart, Compass, Users, Shield, Sparkles,
  ChevronDown, ArrowRight, Sun, Moon, Pen, Bell, BarChart3, Clock
} from "lucide-react";

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const jornadas = [
  { name: "Quem Sou Eu?", sub: "30 dias de autoconhecimento", desc: "Para de viver no piloto automático. Descobre quem és de verdade.", color: "#7c3aed", icon: <Brain size={22} /> },
  { name: "Detox Digital", sub: "30 dias contra o vício em ecrãs", desc: "Retoma o controlo do teu tempo, atenção e saúde mental.", color: "#dc2626", icon: <Smartphone size={22} /> },
  { name: "E Agora, Profissão?", sub: "30 dias para encontrar o teu caminho", desc: "Para quem não sabe o que fazer da vida. Vamos descobrir juntos.", color: "#d97706", icon: <Compass size={22} /> },
  { name: "Relações Reais", sub: "30 dias de relações reais", desc: "Para relações mais profundas, honestas e duradouras.", color: "#e11d48", icon: <Heart size={22} /> },
  { name: "Incerteza", sub: "30 dias contra a ansiedade", desc: "Aprende a viver com o que não controlas sem te perder.", color: "#2563eb", icon: <Shield size={22} /> },
  { name: "Crescimento", sub: "30 dias de evolução real", desc: "Ser mais, de forma sustentável, sem burnout nem comparação.", color: "#16a34a", icon: <Sparkles size={22} /> },
];

const funcionalidades = [
  { icon: <BookOpen size={24} />, title: "Jornadas de 30 Dias", desc: "Módulos estruturados com um desafio por dia: reflexão, escrita, meditação e desafios do mundo real." },
  { icon: <Pen size={24} />, title: "Diário Pessoal", desc: "Espaço privado para escrever livremente. Integrado com as jornadas. Completamente privado." },
  { icon: <Users size={24} />, title: "Cartas de Reflexão", desc: "Deck de perguntas profundas para ti e para jogar com amigos, casal ou família." },
  { icon: <Sun size={24} />, title: "Check-in de Humor", desc: "Regista como te sentes todos os dias. A app adapta sugestões com base no teu estado." },
  { icon: <Bell size={24} />, title: "Notificações Inteligentes", desc: "Lembretes diários para completares a tua reflexão ou desafio do dia." },
  { icon: <BarChart3 size={24} />, title: "Relatórios de Jornada", desc: "Ao completar 30 dias, recebe um relatório personalizado da tua evolução." },
];

const dores = [
  "Fico a repassar coisas que fiz ou disse, tentando perceber quem sou",
  "Penso se estou no caminho certo ou a perder tempo",
  "Sinto uma ansiedade constante sobre o futuro",
  "Comparo-me constantemente com os outros",
];

const faq = [
  { q: "É uma app ou um website?", a: "É um PWA — funciona no browser e pode ser instalado como app no iPhone e Android." },
  { q: "Os meus dados são privados?", a: "Sim, diário e respostas são completamente privados. Ninguém os vê além de ti." },
  { q: "Posso cancelar quando quiser?", a: "Sim, sem compromisso. Cancelas a qualquer momento." },
  { q: "Funciona em iPhone?", a: "Sim! Funciona em iPhone e Android. No iPhone: Safari → Compartilhar → Adicionar à Tela de Início." },
  { q: "Preciso de cartão para experimentar?", a: "Não. 14 dias grátis sem cartão de crédito. Instala a PWA e ganha mais 16 dias." },
];

const CasaDos20LP = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Casa dos 20 — Um refúgio para quem está nos 20</title>
        <meta name="description" content="App de crescimento pessoal com jornadas de 30 dias, diário privado e perguntas reflexivas. Para jovens dos 17 aos 30 anos." />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: "#faf8f5", color: "#1a1a1a" }}>
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: "rgba(250,248,245,0.92)", borderColor: "#e8e4df" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
            <span className="font-heading text-xl font-bold" style={{ color: "#1a1a1a" }}>Casa dos 20</span>
            <div className="hidden md:flex items-center gap-8">
              {["Jornadas", "Funcionalidades", "Preços", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium transition-colors" style={{ color: "#888" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")} onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                  {l}
                </a>
              ))}
            </div>
            <a href="https://acasados20.replit.app" target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-sm font-semibold rounded-full transition-all hover:scale-105" style={{ backgroundColor: "#7c3aed", color: "#fff" }}>
              Começar Grátis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style={{ backgroundColor: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)" }}>
                ✨ 14 dias grátis — sem cartão
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold leading-[1.1] mb-6" style={{ color: "#1a1a1a" }}>
                O refúgio digital para quem tem <span style={{ color: "#7c3aed" }}>20 anos</span> e sente tudo.
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: "#666" }}>
                Um espaço de calma, reflexão e autoconhecimento. Jornadas de 30 dias, diário privado e perguntas que te fazem pensar de verdade.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <a href="https://acasados20.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-full transition-all hover:scale-105 shadow-lg text-white" style={{ backgroundColor: "#7c3aed", boxShadow: "0 0 40px rgba(124,58,237,0.25)" }}>
                Começar grátis — 14 dias <ArrowRight size={18} />
              </a>
              <p className="text-xs mt-3" style={{ color: "#999" }}>Funciona no celular como app. Sem instalar pela loja.</p>
            </FadeUp>
          </div>
        </section>

        {/* Dores */}
        <section className="py-16 md:py-24" style={{ backgroundColor: "#f3f0ec" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-4xl font-heading font-bold mb-10" style={{ color: "#1a1a1a" }}>Identificas-te com alguma destas frases?</h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-4">
              {dores.map((d, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="p-5 rounded-xl text-left" style={{ backgroundColor: "#fff", border: "1px solid #e8e4df" }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: "#555" }}>"{d}"</p>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={0.4}>
              <p className="mt-8 text-base font-medium" style={{ color: "#7c3aed" }}>
                Então a Casa dos 20 foi feita para ti.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="funcionalidades" className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold" style={{ color: "#1a1a1a" }}>Tudo o que precisas para <span style={{ color: "#7c3aed" }}>te conheceres</span></h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funcionalidades.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="p-6 rounded-2xl h-full" style={{ backgroundColor: "#fff", border: "1px solid #e8e4df" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(124,58,237,0.1)", color: "#7c3aed" }}>
                      {f.icon}
                    </div>
                    <h3 className="font-heading font-bold mb-2" style={{ color: "#1a1a1a" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#777" }}>{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Jornadas */}
        <section id="jornadas" className="py-20 md:py-28" style={{ backgroundColor: "#f3f0ec" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4" style={{ color: "#1a1a1a" }}>6 Jornadas de 30 dias</h2>
              <p style={{ color: "#888" }} className="text-lg">Cada uma com um desafio por dia. Escolhe a que faz mais sentido para ti.</p>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jornadas.map((j, i) => (
                <FadeUp key={j.name} delay={i * 0.08}>
                  <div className="p-6 rounded-2xl h-full" style={{ backgroundColor: "#fff", border: "1px solid #e8e4df" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${j.color}15`, color: j.color }}>
                      {j.icon}
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1" style={{ color: "#1a1a1a" }}>{j.name}</h3>
                    <p className="text-xs font-medium mb-2" style={{ color: j.color }}>{j.sub}</p>
                    <p className="text-sm" style={{ color: "#777" }}>{j.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Preços */}
        <section id="preços" className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold" style={{ color: "#1a1a1a" }}>Experimenta tudo, <span style={{ color: "#7c3aed" }}>grátis</span></h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              <FadeUp>
                <div className="p-8 rounded-2xl h-full" style={{ backgroundColor: "#fff", border: "1px solid #e8e4df" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={20} style={{ color: "#7c3aed" }} />
                    <h3 className="font-heading font-bold text-lg">Gratuito</h3>
                  </div>
                  <p className="text-3xl font-heading font-bold mb-1" style={{ color: "#1a1a1a" }}>14 dias</p>
                  <p className="text-xs mb-4" style={{ color: "#999" }}>+ 16 dias bônus ao instalar como app</p>
                  <ul className="space-y-2 text-sm" style={{ color: "#555" }}>
                    {["Acesso completo a tudo", "Sem cartão de crédito", "Até 30 dias grátis com bônus"].map((l) => (
                      <li key={l} className="flex items-start gap-2"><span style={{ color: "#7c3aed" }}>✓</span> {l}</li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="p-8 rounded-2xl h-full relative overflow-hidden" style={{ backgroundColor: "#7c3aed", color: "#fff" }}>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    Recomendado
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} />
                    <h3 className="font-heading font-bold text-lg">Premium</h3>
                  </div>
                  <p className="text-3xl font-heading font-bold mb-1">Mensal ou Anual</p>
                  <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>O anual sai mais barato</p>
                  <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {["Todas as jornadas ilimitadas", "Todas as cartas de reflexão", "Modo jogo de conversa", "Relatórios completos", "Funcionalidades futuras"].map((l) => (
                      <li key={l} className="flex items-start gap-2"><span>✓</span> {l}</li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* O Criador */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#f3f0ec" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6" style={{ color: "#1a1a1a" }}>Criado por Quinzinho Oliveira</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#666" }}>
                Autor do livro "A Casa dos 20", disponível na Apple Books e Clube de Autores. A app é a extensão digital do livro — um companheiro diário para quem quer trabalhar o que o livro ensina.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="https://books.apple.com/us/book/a-casa-dos-20/id6760140786" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full text-sm font-medium" style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                  Apple Books
                </a>
                <a href="https://clubedeautores.pt/livro/a-casa-dos-20" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full text-sm font-medium border" style={{ borderColor: "#ccc", color: "#1a1a1a" }}>
                  Clube de Autores
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold" style={{ color: "#1a1a1a" }}>Perguntas frequentes</h2>
            </FadeUp>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid #e8e4df" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                      <span className="font-medium text-sm pr-4" style={{ color: "#1a1a1a" }}>{f.q}</span>
                      <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: "#7c3aed" }} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#777" }}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 md:py-28" style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6 text-white">Começa hoje. Grátis. Sem cartão.</h2>
              <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>14 dias de acesso completo. A vida que sempre quiseste começa com uma pergunta.</p>
              <a href="https://acasados20.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl" style={{ backgroundColor: "#fff", color: "#7c3aed" }}>
                Começar Agora <ArrowRight size={20} />
              </a>
            </FadeUp>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t" style={{ backgroundColor: "#faf8f5", borderColor: "#e8e4df" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-heading font-bold mb-2" style={{ color: "#1a1a1a" }}>Casa dos 20</p>
            <p className="text-xs" style={{ color: "#999" }}>© 2026 Casa dos 20. Criado por Quinzinho Oliveira.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CasaDos20LP;
