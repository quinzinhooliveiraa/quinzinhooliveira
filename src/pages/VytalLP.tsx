import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import {
  QrCode, Trophy, Camera, Banknote, MapPin, Eye, Wifi, Users, Smartphone,
  ChevronDown, ArrowRight, Shield, Zap, BarChart3, Dumbbell, Timer, Target
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

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  if (inView && count === 0) {
    let start = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 30);
  }

  return <span ref={ref}>{count.toLocaleString("pt-BR")}{suffix}</span>;
};

const steps = [
  { icon: <QrCode size={28} />, title: "Deposite via Pix", text: "Carregue seu saldo com Pix em segundos. Mínimo de R$ 30. Seu dinheiro fica guardado em carteira segura." },
  { icon: <Trophy size={28} />, title: "Escolha seu Desafio", text: "Participe de desafios públicos ou crie o seu. Check-in diário, corrida por distância e muito mais." },
  { icon: <Camera size={28} />, title: "Check-in com Câmera e GPS", text: "Registre presença com foto e localização GPS. Um moderador valida. Faltou? Perdeu pontos." },
  { icon: <Banknote size={28} />, title: "Quem Cumpriu, Ganha", text: "O prêmio total é dividido entre quem cumpriu todas as condições. Saque via Pix na hora." },
];

const diferenciais = [
  { icon: <Banknote size={24} />, title: "Dinheiro real em jogo", text: "Não é gamification falsa. Você coloca e ganha de verdade." },
  { icon: <MapPin size={24} />, title: "Check-in com GPS + câmera", text: "Cada presença é verificada por localização e foto." },
  { icon: <Eye size={24} />, title: "Moderação humana", text: "Todo check-in é revisado. Fair play de verdade." },
  { icon: <Wifi size={24} />, title: "Funciona offline", text: "Sem internet? O app sincroniza quando reconectar." },
  { icon: <Users size={24} />, title: "Comunidades", text: "Academias e personal trainers criam grupos exclusivos." },
  { icon: <Smartphone size={24} />, title: "Sem app store", text: "Instala direto pelo navegador, em qualquer celular." },
];

const desafios = [
  { icon: <Dumbbell size={24} />, title: "Check-in Diário", rule: "Faltou um dia = eliminado", example: "30 dias de treino — quem não faltar divide R$ 2.000" },
  { icon: <Shield size={24} />, title: "Survival", rule: "Pode faltar até X dias", example: "60 dias, máx 5 faltas — prêmio de R$ 5.000" },
  { icon: <Timer size={24} />, title: "Corrida por Distância", rule: "Acumule km — primeiro a bater a meta vence", example: "Primeiro a completar 100km leva R$ 500" },
  { icon: <Target size={24} />, title: "Ranking", rule: "Mais pontos = vencedor", example: "Top 3 em quilometragem do mês divide o prêmio" },
];

const faq = [
  { q: "Preciso baixar o app na App Store ou Google Play?", a: "Não! O VYTAL é um Progressive Web App (PWA). Você instala direto pelo navegador — Android ou iPhone." },
  { q: "Como funciona o depósito?", a: "Gere um QR Code Pix dentro do app, pague pelo banco de costume, e o saldo aparece em segundos. Mínimo de R$ 30." },
  { q: "E se eu não conseguir fazer o check-in?", a: "O app funciona offline: registra o check-in sem internet e sincroniza depois. Em casos excepcionais, o moderador pode ajustar." },
  { q: "Quem valida os check-ins?", a: "Cada desafio tem um moderador que revisa fotos e GPS. Check-ins suspeitos são flagrados." },
  { q: "Posso criar meu próprio desafio?", a: "Sim! Qualquer usuário pode criar desafios públicos ou privados com suas próprias regras." },
  { q: "Quanto tempo leva para receber o prêmio?", a: "Ao final do desafio, o prêmio vai para sua carteira e você saca via Pix a qualquer hora." },
  { q: "E se eu sair no meio do desafio?", a: "Participantes eliminados perdem o valor de entrada — esse valor compõe o prêmio dos vencedores." },
  { q: "O VYTAL tem aplicativo para iOS?", a: "Sim, via PWA. No iPhone, abra no Safari → Compartilhar → Adicionar à Tela de Início." },
];

const depoimentos = [
  { text: "Entrei num desafio de 30 dias de musculação, R$ 50 de entrada. No final, recebi R$ 190 de volta. O dinheiro em jogo faz toda a diferença.", author: "Lucas M., 29 anos", city: "Belo Horizonte" },
  { text: "Criei um desafio de corrida pra minha turma de bike. O VYTAL cuidou de tudo — entrada, check-in, moderação e premiação.", author: "Ana P., 34 anos", city: "São Paulo" },
  { text: "Sempre quis ser cobrado pra treinar de verdade. Com o VYTAL, não tem desculpa. O GPS não mente e o moderador não perdoa.", author: "Rafael T., 26 anos", city: "Curitiba" },
];

const VytalLP = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="VYTAL — Desafios Fitness com Premiação Real via Pix"
        description="Entre em desafios fitness, faça check-ins com câmera e GPS, e ganhe prêmios reais via Pix. Só quem cumpre ganha."
      />

      <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#fff" }}>
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: "rgba(10,10,10,0.9)", borderColor: "#1a1a1a" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
            <span className="font-heading text-xl font-bold" style={{ color: "#22c55e" }}>VYTAL</span>
            <div className="hidden md:flex items-center gap-8">
              {["Como Funciona", "Desafios", "Comunidades", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="text-sm font-medium transition-colors" style={{ color: "#999" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}>
                  {l}
                </a>
              ))}
            </div>
            <a href="https://vytal.replit.app" target="_blank" rel="noopener noreferrer" className="px-5 py-2 text-sm font-semibold rounded-full transition-all hover:scale-105" style={{ backgroundColor: "#22c55e", color: "#0a0a0a" }}>
              Começar Agora →
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeUp>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                  🏆 Desafios com dinheiro real
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold leading-[1.1] mb-6">
                  Transforme seu treino em{" "}
                  <span style={{ color: "#22c55e" }}>premiação real.</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: "#a3a3a3" }}>
                  Entre em desafios fitness com entrada via Pix, faça check-ins diários com câmera e GPS, e quem cumprir fica com o prêmio. Sem enrolação, sem desculpa.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="space-y-3 mb-8">
                  {[
                    "✅ Depósito e saque via Pix — instantâneo",
                    "📸 Check-in com foto + GPS em tempo real",
                    "🏆 Prêmio vai só para quem completar",
                    "🔒 Moderação humana para fair play",
                  ].map((b) => (
                    <p key={b} className="text-sm" style={{ color: "#d4d4d4" }}>{b}</p>
                  ))}
                </div>
              </FadeUp>
              <FadeUp delay={0.4}>
                <a href="https://vytal.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-full transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "#22c55e", color: "#0a0a0a", boxShadow: "0 0 40px rgba(34,197,94,0.3)" }}>
                  Instalar o App Gratuitamente <ArrowRight size={18} />
                </a>
                <p className="text-xs mt-3" style={{ color: "#666" }}>Funciona direto no celular, sem instalar pela loja de apps.</p>
              </FadeUp>
            </div>
            <FadeUp delay={0.3} className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-[80px] opacity-30" style={{ backgroundColor: "#22c55e" }} />
                <div className="relative rounded-2xl overflow-hidden border shadow-2xl" style={{ borderColor: "#262626" }}>
                  <img src="/placeholder.svg" alt="VYTAL App" className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#22c55e" }}>
                        <Dumbbell size={36} color="#0a0a0a" />
                      </div>
                      <p className="font-heading text-2xl font-bold" style={{ color: "#22c55e" }}>VYTAL</p>
                      <p className="text-sm mt-1" style={{ color: "#666" }}>Bote dinheiro no exercício</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-20 md:py-28" style={{ backgroundColor: "#111" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Como o VYTAL funciona</h2>
              <p style={{ color: "#666" }} className="text-lg">Em 4 passos, do depósito ao prêmio</p>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.1}>
                  <div className="relative p-6 rounded-2xl border h-full" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <div className="text-xs font-bold mb-4" style={{ color: "#22c55e" }}>0{i + 1}</div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                      {s.icon}
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#999" }}>{s.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">O que torna o VYTAL <span style={{ color: "#22c55e" }}>único</span></h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diferenciais.map((d, i) => (
                <FadeUp key={d.title} delay={i * 0.08}>
                  <div className="p-6 rounded-2xl border transition-colors hover:border-[#22c55e]/30" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                      {d.icon}
                    </div>
                    <h3 className="font-heading font-bold mb-2">{d.title}</h3>
                    <p className="text-sm" style={{ color: "#999" }}>{d.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Tipos de Desafio */}
        <section id="desafios" className="py-20 md:py-28" style={{ backgroundColor: "#111" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Para todo tipo de atleta</h2>
              <p style={{ color: "#666" }} className="text-lg">Escolha o formato que combina com você</p>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              {desafios.map((d, i) => (
                <FadeUp key={d.title} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{d.icon}</div>
                      <h3 className="font-heading font-bold text-lg">{d.title}</h3>
                    </div>
                    <p className="text-sm mb-2" style={{ color: "#999" }}>{d.rule}</p>
                    <p className="text-xs px-3 py-1.5 rounded-lg inline-block" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                      Ex: {d.example}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Prova Social */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8">Quem já está treinando <span style={{ color: "#22c55e" }}>(e ganhando)</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { value: 48000, prefix: "R$ ", suffix: "+", label: "em prêmios" },
                  { value: 1200, suffix: "+", label: "check-ins" },
                  { value: 94, suffix: "%", label: "completam" },
                  { value: 48, suffix: "/5", label: "avaliação", divBy: 10 },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-2xl md:text-3xl font-heading font-bold" style={{ color: "#22c55e" }}>
                      {m.prefix || ""}<CountUp target={m.divBy ? m.value / m.divBy : m.value} suffix={m.suffix} />
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#666" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-6">
              {depoimentos.map((d, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border h-full flex flex-col" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <p className="text-sm italic leading-relaxed flex-1 mb-4" style={{ color: "#d4d4d4" }}>"{d.text}"</p>
                    <div>
                      <p className="font-semibold text-sm">{d.author}</p>
                      <p className="text-xs" style={{ color: "#666" }}>{d.city}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section className="py-20 md:py-28" style={{ backgroundColor: "#111" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">Seu dinheiro, <span style={{ color: "#22c55e" }}>protegido</span></h2>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: <Shield size={28} />, title: "Saldo bloqueado", text: "O valor da inscrição fica bloqueado enquanto o desafio está ativo." },
                { icon: <BarChart3 size={28} />, title: "Taxa única de 10%", text: "Sem taxas escondidas. O restante é dividido entre os vencedores." },
                { icon: <Zap size={28} />, title: "Saque via Pix", text: "Prêmio na conta? Saque quando quiser, na hora, pelo Pix." },
              ].map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <div className="w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{s.icon}</div>
                    <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm" style={{ color: "#999" }}>{s.text}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp>
              <p className="text-center text-xs px-4 py-3 rounded-xl" style={{ backgroundColor: "#1a1a1a", color: "#666" }}>
                🔒 Pagamentos processados via AbacatePay — gateway homologado no Brasil. Chaves Pix criptografadas com AES-256.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Comunidades */}
        <section id="comunidades" className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Crie ou entre em uma <span style={{ color: "#22c55e" }}>comunidade</span></h2>
              <p className="text-lg mb-4" style={{ color: "#999" }}>Para academias, grupos de corrida, times e personal trainers</p>
              <p className="text-sm mb-6 leading-relaxed max-w-2xl mx-auto" style={{ color: "#666" }}>
                Comunidades no VYTAL são grupos com desafios exclusivos. Donos de academia criam desafios só para seus alunos. Personal trainers monetizam seus grupos com uma taxa adicional de 5%.
              </p>
              <a href="https://vytal.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all hover:scale-105" style={{ backgroundColor: "#22c55e", color: "#0a0a0a" }}>
                Criar minha comunidade <ArrowRight size={18} />
              </a>
            </FadeUp>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28" style={{ backgroundColor: "#111" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <FadeUp className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">Dúvidas frequentes</h2>
            </FadeUp>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#171717", borderColor: "#262626" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-sm pr-4">{f.q}</span>
                      <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: "#22c55e" }} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#999" }}>{f.a}</p>
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
        <section className="py-20 md:py-28" style={{ backgroundColor: "#14532d" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6">Seu próximo treino pode te pagar.</h2>
              <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>Instale o VYTAL, entre em um desafio e prove que você não vai desistir.</p>
              <a href="https://vytal.replit.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl" style={{ backgroundColor: "#22c55e", color: "#0a0a0a", boxShadow: "0 0 60px rgba(34,197,94,0.4)" }}>
                Instalar o VYTAL Agora — É Grátis <ArrowRight size={20} />
              </a>
              <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>Funciona no Android e iPhone. Sem app store. Sem taxas para criar conta.</p>
            </FadeUp>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t" style={{ backgroundColor: "#0a0a0a", borderColor: "#1a1a1a" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {[
                { title: "App", links: ["Como Funciona", "Tipos de Desafio", "Comunidades", "Instalar (PWA)"] },
                { title: "Empresa", links: ["Sobre o VYTAL", "Blog", "Carreiras", "Imprensa"] },
                { title: "Suporte", links: ["Central de Ajuda", "Contato"] },
                { title: "Legal", links: ["Termos de Uso", "Política de Privacidade", "Termos Financeiros"] },
              ].map((col) => (
                <div key={col.title}>
                  <p className="font-heading font-bold text-sm mb-3" style={{ color: "#22c55e" }}>{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}><span className="text-xs cursor-pointer hover:underline" style={{ color: "#666" }}>{l}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-6 text-center" style={{ borderColor: "#1a1a1a" }}>
              <p className="text-xs" style={{ color: "#444" }}>© 2026 VYTAL. Todos os direitos reservados. Pagamentos via AbacatePay.</p>
              <p className="text-xs mt-1" style={{ color: "#333" }}>VYTAL não é uma casa de apostas. É uma plataforma de desafios fitness com premiação por cumprimento de metas.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default VytalLP;
