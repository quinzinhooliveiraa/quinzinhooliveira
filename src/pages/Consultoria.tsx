import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, TrendingUp, Wallet, Home, GraduationCap, Plane, Heart, Briefcase,
  DollarSign, PiggyBank, ShieldCheck, BarChart3, CircleDollarSign, AlertTriangle,
  CheckCircle2, HelpCircle, Sparkles, Award, Shield, Target, Instagram
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import quinzinhoImg from "@/assets/quinzinho-consultoria.jpg";

/* ───── Animation Helpers ───── */

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

const Stagger = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 24, scale: 0.96 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ───── Data ───── */

const objectives = [
  { icon: Plane, title: "Viagem Internacional", description: "Um plano financeiro personalizado para você viajar sem comprometer seu orçamento." },
  { icon: Home, title: "Casa Própria", description: "Estratégia para acumular capital e encontrar o melhor caminho para o financiamento." },
  { icon: Briefcase, title: "Negócio Próprio", description: "Estruturação do plano de negócios com as estratégias de investimento adequadas." },
  { icon: Wallet, title: "Vida Financeira Saudável", description: "Controle total sobre suas finanças para tomar decisões com mais confiança." },
  { icon: GraduationCap, title: "Educação dos Filhos", description: "Estratégias de acúmulo para garantir o melhor futuro educacional para eles." },
  { icon: Heart, title: "Casamento dos Sonhos", description: "Planejamento completo para que você case sem estresse financeiro." },
];

const pillars = [
  { icon: DollarSign, title: "Organização Financeira", description: "Análise completa da sua situação com um plano que respeita seu estilo de vida." },
  { icon: BarChart3, title: "Expansão Patrimonial", description: "Identificação de oportunidades de crescimento sustentável alinhadas à sua visão de futuro." },
  { icon: PiggyBank, title: "Acúmulo de Capital", description: "Soluções para rentabilizar seu capital com decisões calculadas e seguras." },
  { icon: ShieldCheck, title: "Blindagem Patrimonial", description: "Proteção do seu patrimônio contra incertezas e preservação do seu legado." },
];

const steps = [
  { number: "01", title: "Solicite seu diagnóstico", description: "Preencha o formulário abaixo. Leva menos de um minuto." },
  { number: "02", title: "Análise personalizada", description: "Suas finanças são analisadas e você recebe um panorama completo, sem compromisso." },
  { number: "03", title: "Acelere suas conquistas", description: "Com um plano sob medida, comece a trilhar o caminho mais rápido rumo aos seus objetivos." },
];

const profiles = [
  { icon: AlertTriangle, accent: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/10", title: "No vermelho", sub: "Gasta mais do que ganha", description: "Dívidas se acumulam e não sabe por onde começar. A consultoria reorganiza sua vida financeira e cria um plano para sair dessa situação." },
  { icon: CircleDollarSign, accent: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/10", title: "No zero a zero", sub: "Paga contas mas não sobra", description: "Você está no piloto automático sem conseguir guardar. A consultoria encontra os vazamentos e cria margem no seu orçamento." },
  { icon: CheckCircle2, accent: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10", title: "No positivo", sub: "Sobra mas não sabe o que fazer", description: "Seu dinheiro está parado sem propósito. A consultoria define seus objetivos e estrutura um plano financeiro sob medida." },
];

const planejamento360 = [
  { icon: Target, title: "Definição de objetivos", desc: "Metas claras e plano de ação" },
  { icon: DollarSign, title: "Fluxo de caixa", desc: "Orçamento e controle financeiro" },
  { icon: ShieldCheck, title: "Reserva de emergência", desc: "Proteção para imprevistos" },
  { icon: Heart, title: "Planejamento sucessório", desc: "Segurança para sua família" },
  { icon: Home, title: "Imóveis e patrimônio", desc: "Gestão de bens e ativos" },
  { icon: TrendingUp, title: "Investimentos", desc: "Orientação sem vender produtos" },
  { icon: Briefcase, title: "Aposentadoria", desc: "Independência financeira no futuro" },
  { icon: Shield, title: "Seguros", desc: "Proteção adequada às suas necessidades" },
  { icon: GraduationCap, title: "Educação", desc: "Planejamento para formação dos filhos" },
  { icon: BarChart3, title: "Impostos", desc: "Estratégias de otimização tributária" },
  { icon: AlertTriangle, title: "Dívidas", desc: "Reorganização e quitação" },
];

const faqs = [
  { q: "Qual a diferença entre consultor e assessor financeiro?", a: "O consultor analisa sua vida financeira inteira, cria um planejamento personalizado e te acompanha. Não vende produto, orienta sobre todas as áreas: orçamento, dívidas, seguros, aposentadoria. O assessor foca em investimentos. Na W1, você tem acesso aos dois." },
  { q: "O que é consultoria financeira?", a: "É ter um profissional que entende sua realidade e monta um plano sob medida. Orçamento, grandes compras, patrimônio, aposentadoria, seguros, impostos: tudo é coberto." },
  { q: "Para quem é?", a: "Para qualquer pessoa que queira tomar decisões financeiras melhores. Esteja no vermelho, no zero ou no positivo, a consultoria é adaptada ao seu momento." },
  { q: "O diagnóstico é realmente gratuito?", a: "Sim. O diagnóstico inicial é 100% gratuito e sem compromisso. Serve para entender sua situação e mostrar como a consultoria pode ajudar." },
  { q: "Preciso ter muito dinheiro?", a: "Não. A consultoria é para quem quer organizar o que tem, pouco ou muito. O trabalho é feito com a sua realidade." },
];

/* ───── Form Schema ───── */

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  telefone: z.string().trim().min(10, "Telefone inválido (mínimo 10 dígitos)").max(20, "Telefone muito longo"),
  situacaoFinanceira: z.enum(["negativo", "zero", "positivo"], {
    required_error: "Selecione sua situação atual",
  }),
  capacidadePoupanca: z.string().min(1, "Selecione uma opção"),
  objetivos: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),
  interesseDesenvolvimento: z.enum(["sim", "nao", "talvez"], {
    required_error: "Selecione uma opção",
  }),
  comentarios: z.string().max(1000, "Comentário muito longo").optional(),
});

type FormData = z.infer<typeof formSchema>;

/* ───── Contact Form ───── */

const DiagnosticoForm = () => {
  const [selectedObjetivos, setSelectedObjetivos] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      comentarios: "",
      objetivos: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    const message = `Situação: ${data.situacaoFinanceira}\nPoupança: ${data.capacidadePoupanca}\nObjetivos: ${data.objetivos.join(", ")}\nDesenvolvimento: ${data.interesseDesenvolvimento}${data.comentarios ? `\nComentários: ${data.comentarios}` : ""}`;
    await supabase.from("contact_submissions").insert({
      name: data.nome,
      email: data.email,
      subject: `Diagnóstico - Tel: ${data.telefone}`,
      message,
      source: "consultoria",
    });
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
          <CheckCircle2 size={48} className="text-primary mx-auto mb-4 sm:w-14 sm:h-14" />
        </motion.div>
        <h3 className="font-heading text-lg sm:text-xl font-bold mb-2">Diagnóstico solicitado!</h3>
        <p className="text-sm sm:text-base text-muted-foreground">Eu vou entrar em contato em breve para realizar seu diagnóstico gratuito.</p>
      </motion.div>
    );
  }

  const toggleObjetivo = (objetivo: string) => {
    const updated = selectedObjetivos.includes(objetivo)
      ? selectedObjetivos.filter(o => o !== objetivo)
      : [...selectedObjetivos, objetivo];
    setSelectedObjetivos(updated);
    form.setValue("objetivos", updated);
  };

  const objetivosOptions = [
    "Organizar minhas finanças",
    "Sair das dívidas",
    "Criar reserva de emergência",
    "Comprar imóvel",
    "Educação dos filhos",
    "Planejar aposentadoria",
    "Viagens",
    "Abrir negócio próprio",
  ];

  return (
    <Form {...form}>
      <motion.form
        id="diagnostico"
        onSubmit={form.handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center pb-3 sm:pb-4 border-b border-border">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={20} className="text-primary sm:hidden" />
            <Sparkles size={24} className="text-primary hidden sm:block" />
          </div>
          <h3 className="font-heading text-lg sm:text-2xl font-bold mb-2">Diagnóstico Financeiro Gratuito</h3>
          <p className="text-sm text-muted-foreground">
            Preencha abaixo e <strong className="text-foreground">eu pessoalmente</strong> analiso sua situação e te mostro o caminho.
          </p>
        </div>

        {/* Nome e Email */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" className="bg-background/50 border-border text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm">Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" className="bg-background/50 border-border text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Telefone */}
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Telefone (WhatsApp) *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(00) 00000-0000" className="bg-background/50 border-border text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Situação Financeira */}
        <FormField
          control={form.control}
          name="situacaoFinanceira"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Como você termina o mês? *</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2">
                  <div 
                    className={`p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                      field.value === "negativo" 
                        ? "border-red-500 bg-red-500/10" 
                        : "border-border bg-background/50 hover:border-red-500/50"
                    }`}
                    onClick={() => field.onChange("negativo")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem value="negativo" id="negativo" />
                      <Label htmlFor="negativo" className="cursor-pointer font-semibold text-red-400 text-xs sm:text-sm">No vermelho</Label>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Gasto mais do que ganho</p>
                  </div>
                  <div 
                    className={`p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                      field.value === "zero" 
                        ? "border-amber-500 bg-amber-500/10" 
                        : "border-border bg-background/50 hover:border-amber-500/50"
                    }`}
                    onClick={() => field.onChange("zero")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem value="zero" id="zero" />
                      <Label htmlFor="zero" className="cursor-pointer font-semibold text-amber-400 text-xs sm:text-sm">No zero a zero</Label>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Pago contas mas não sobra</p>
                  </div>
                  <div 
                    className={`p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                      field.value === "positivo" 
                        ? "border-emerald-500 bg-emerald-500/10" 
                        : "border-border bg-background/50 hover:border-emerald-500/50"
                    }`}
                    onClick={() => field.onChange("positivo")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem value="positivo" id="positivo" />
                      <Label htmlFor="positivo" className="cursor-pointer font-semibold text-emerald-400 text-xs sm:text-sm">Sobra dinheiro</Label>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Consigo guardar algo</p>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacidade de Poupança */}
        <FormField
          control={form.control}
          name="capacidadePoupanca"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Quanto consegue (ou gostaria de) guardar por mês? *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background/50 border-border text-sm">
                    <SelectValue placeholder="Selecione uma faixa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nada">Não consigo guardar nada</SelectItem>
                  <SelectItem value="ate-200">Até R$ 200</SelectItem>
                  <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                  <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                  <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                  <SelectItem value="acima-2000">Acima de R$ 2.000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Objetivos */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm">Quais seus principais objetivos? * (selecione um ou mais)</Label>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {objetivosOptions.map((objetivo) => (
              <div
                key={objetivo}
                onClick={() => toggleObjetivo(objetivo)}
                className={`p-2.5 sm:p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedObjetivos.includes(objetivo)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background/50 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedObjetivos.includes(objetivo) ? "bg-primary border-primary" : "border-border"
                  }`}>
                    {selectedObjetivos.includes(objetivo) && (
                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm">{objetivo}</span>
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.objetivos && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.objetivos.message}</p>
          )}
        </div>

        {/* Interesse em Desenvolvimento */}
        <FormField
          control={form.control}
          name="interesseDesenvolvimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Tem interesse em aprender a organizar suas finanças? *</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="sim" />
                    <Label htmlFor="sim" className="cursor-pointer font-normal text-xs sm:text-sm">Sim, quero aprender</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="nao" />
                    <Label htmlFor="nao" className="cursor-pointer font-normal text-xs sm:text-sm">Não, prefiro só receber o plano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="talvez" id="talvez" />
                    <Label htmlFor="talvez" className="cursor-pointer font-normal text-xs sm:text-sm">Depende da abordagem</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comentários */}
        <FormField
          control={form.control}
          name="comentarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Comentários Adicionais (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte mais sobre seus desafios, dúvidas ou expectativas..."
                  className="bg-background/50 border-border min-h-[80px] sm:min-h-[100px] text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-colors hover:bg-primary/90 text-sm sm:text-base"
        >
          Solicitar Diagnóstico Gratuito <ArrowRight size={18} />
        </motion.button>
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center !mt-3">100% gratuito • Sem compromisso • Seus dados estão protegidos</p>
      </motion.form>
    </Form>
  );
};

/* ───── Scroll CTA ───── */

const ScrollCTA = ({ text, variant = "primary" }: { text: string; variant?: "primary" | "outline" }) => (
  <motion.a
    href="#diagnostico"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" });
    }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 font-bold rounded-xl transition-colors text-sm sm:text-lg w-full sm:w-auto justify-center ${
      variant === "primary"
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    }`}
  >
    {text} <ArrowRight size={18} />
  </motion.a>
);

/* ───── Page ───── */

const Consultoria = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-consultoria", "theme-consultoria-dark");
    root.classList.add(theme === "dark" ? "theme-consultoria-dark" : "theme-consultoria");
    return () => {
      root.classList.remove("theme-consultoria", "theme-consultoria-dark");
    };
  }, [theme]);

  return (
  <div className="pt-16 overflow-hidden">

    {/* ═══ 1. HERO ═══ */}
    <section className="relative py-12 sm:py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-primary/3 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <span className="w-6 sm:w-10 h-px bg-primary" />
            <span className="text-primary font-heading font-bold text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              Consultoria Financeira Pessoal
            </span>
            <span className="w-6 sm:w-10 h-px bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-4 sm:mb-6 leading-[1.1]"
          >
            Seja lá qual for o seu objetivo,{" "}
            <span className="text-primary relative inline-block">
              existe um caminho.
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 sm:h-1 bg-primary/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.9 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-5 leading-relaxed"
          >
            Consultoria financeira pessoal certificada pela W1, a maior do Brasil. Uma análise financeira completa custa <strong className="text-foreground line-through opacity-60">R$ 500</strong> — mas eu faço questão de <strong className="text-foreground">pagar essa análise por você</strong>. Eu quero que você acorde pra sua vida financeira.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-card/50 border border-border rounded-xl p-3 sm:p-4 mb-5 sm:mb-8 inline-block"
          >
            <p className="text-foreground font-medium text-xs sm:text-base">
              ⚠️ <strong>Isso não é sobre investimentos.</strong> É sobre organizar sua vida financeira de verdade.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10"
          >
            {["100% Gratuito", "Sem compromisso", "Análise personalizada"].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold rounded-full border border-primary/20">
                <CheckCircle2 size={10} className="sm:w-3 sm:h-3" /> {badge}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ScrollCTA text="Quero meu diagnóstico gratuito" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* ═══ 2. AUTHORITY BAR ═══ */}
    <section className="py-4 sm:py-6 border-y border-border bg-card/50">
      <div className="section-container">
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 sm:gap-y-3 text-xs sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 sm:gap-2"><Shield size={14} className="text-primary sm:w-4 sm:h-4" /> Consultoria nº1 do Brasil</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><Target size={14} className="text-primary sm:w-4 sm:h-4" /> +100 mil clientes W1</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><Award size={14} className="text-primary sm:w-4 sm:h-4" /> +15 anos de mercado</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 size={14} className="text-primary sm:w-4 sm:h-4" /> Certificação W1</span>
        </div>
      </div>
    </section>

    {/* ═══ 3. PROBLEMA ═══ */}
    <section className="py-12 sm:py-24">
      <div className="section-container">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Você se reconhece?
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            O problema que você enfrenta hoje
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Não importa em qual desses cenários você está: <strong className="text-foreground">a consultoria é adaptada à sua realidade.</strong>
          </p>
        </FadeUp>
        <Stagger className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {profiles.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div whileHover={{ y: -6 }} className={`p-5 sm:p-7 bg-card border ${p.border} rounded-2xl h-full`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${p.bg} flex items-center justify-center mb-4 sm:mb-5`}>
                  <p.icon size={22} className={`${p.accent} sm:w-[26px] sm:h-[26px]`} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${p.accent}`}>{p.title}</span>
                <h3 className="font-heading text-base sm:text-lg font-bold mt-1 mb-2">{p.sub}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>

    {/* ═══ 4. SOBRE ═══ */}
    <section className="py-12 sm:py-24 bg-secondary/50">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          <FadeUp className="order-2 md:order-1">
            <div className="relative flex justify-center">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <motion.img
                src={quinzinhoImg}
                alt="Quinzinho Oliveira, Consultor Financeiro"
                className="relative w-full max-w-[280px] sm:max-w-[380px] rounded-2xl shadow-2xl object-cover aspect-[3/4]"
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 md:right-0 bg-card border border-border rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-primary sm:w-5 sm:h-5" />
                  <div>
                    <p className="font-heading text-[10px] sm:text-xs font-bold">Certificado W1</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">Consultoria nº1 do Brasil</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="order-1 md:order-2">
            <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 inline-flex items-center gap-2 sm:gap-3">
              <span className="w-6 sm:w-10 h-px bg-primary" /> Sobre
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Quinzinho Oliveira
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
              Empreendedor, autor e consultor financeiro certificado pela <strong className="text-foreground">W1</strong>, a maior consultoria financeira do Brasil. Com experiência em ajudar pessoas a saírem do caos financeiro e conquistarem seus objetivos.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
              A missão é simples: <strong className="text-foreground">te ajudar a tomar decisões financeiras melhores, mais rápido.</strong> Sem fórmula mágica, com método, planejamento e compromisso com o seu resultado.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* ═══ 5. CONSULTOR vs ASSESSOR ═══ */}
    <section className="py-12 sm:py-24">
      <div className="section-container max-w-5xl">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Entenda a diferença
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            Consultor ≠ Assessor
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            A maioria confunde. São coisas diferentes, e entender isso faz diferença para você.
          </p>
        </FadeUp>
        <Stagger className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.01 }} className="p-5 sm:p-8 bg-card border-2 border-primary/30 rounded-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5">
                  <HelpCircle size={22} className="text-primary sm:w-[26px] sm:h-[26px]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Consultoria Financeira</span>
                <h3 className="font-heading text-lg sm:text-xl font-bold mt-1 mb-3 sm:mb-4">O que a consultoria faz por você</h3>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  {["Análise completa da sua vida financeira", "Planejamento personalizado sob medida", "Acompanhamento da execução do plano", "Organização de orçamento, dívidas, seguros", "Orientação sem vender investimentos"].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0 sm:w-4 sm:h-4" /> {t}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.01 }} className="p-5 sm:p-8 bg-card border border-border rounded-2xl h-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 sm:mb-5">
                <TrendingUp size={22} className="text-muted-foreground sm:w-[26px] sm:h-[26px]" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Complementar</span>
              <h3 className="font-heading text-lg sm:text-xl font-bold mt-1 mb-3 sm:mb-4">Assessor de Investimentos</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                {["Focado em aplicações financeiras", "Executa ordens de investimento", "Trabalha com produtos de corretoras", "Complementar ao consultor"].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 size={14} className="text-muted-foreground/50 mt-0.5 shrink-0 sm:w-4 sm:h-4" /> {t}</li>
                ))}
              </ul>
            </motion.div>
          </StaggerItem>
        </Stagger>
        <FadeUp delay={0.2}>
          <p className="text-center text-foreground font-medium mt-6 sm:mt-10 text-sm sm:text-lg">
            Com a W1, você tem acesso aos dois: <strong className="text-primary">planejamento financeiro completo</strong> com assessoria quando necessário.
          </p>
        </FadeUp>
      </div>
    </section>

    {/* ═══ 6. PLANEJAMENTO 360 ═══ */}
    <section className="py-12 sm:py-24 bg-secondary/50">
      <div className="section-container">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Muito além de investimentos
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            Todas as áreas da sua vida financeira, cobertas
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
            A maioria pensa que é só sobre investir dinheiro. <strong className="text-foreground">Não é.</strong> O planejamento cobre <span className="text-foreground font-medium">todas</span> as áreas — começando pelo básico: organização e controle.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto items-stretch">
          <FadeUp delay={0.1}>
            <div className="p-5 sm:p-8 bg-card border border-border rounded-2xl text-center h-full flex flex-col justify-center">
              <h3 className="font-heading text-sm sm:text-base font-bold mb-6 sm:mb-8 text-muted-foreground">
                O que as pessoas <span className="text-foreground">acham</span> que fazemos:
              </h3>
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  className="bg-muted/30 border-2 border-dashed border-border rounded-2xl w-full max-w-[180px] sm:max-w-[240px] aspect-square flex items-center justify-center mx-auto"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <span className="font-heading text-lg sm:text-2xl text-muted-foreground/40">Investimentos</span>
                </motion.div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="p-5 sm:p-8 bg-card border-2 border-primary/20 rounded-2xl text-center h-full">
              <h3 className="font-heading text-sm sm:text-base font-bold mb-4 sm:mb-6 text-muted-foreground">
                O que <span className="text-primary">realmente</span> fazemos:
              </h3>
              <Stagger className="space-y-1.5 sm:space-y-2">
                {planejamento360.map((item) => (
                  <StaggerItem key={item.title}>
                    <motion.div
                      whileHover={{ x: 4, scale: 1.02 }}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-start gap-2 sm:gap-3 ${
                        item.title === "Dívidas"
                          ? "bg-primary/15 text-primary border border-primary/25"
                          : "bg-muted/30 text-foreground/80 border border-border/40 hover:border-primary/20"
                      }`}
                    >
                      <item.icon size={16} className="mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* ═══ 7. 4 PILARES ═══ */}
    <section className="py-12 sm:py-24">
      <div className="section-container">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            O método
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            Quatro pilares que transformam suas finanças
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Método estruturado que cobre todas as dimensões da sua vida financeira.
          </p>
        </FadeUp>
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {pillars.map((p, i) => (
            <StaggerItem key={p.title}>
              <motion.div whileHover={{ y: -4 }} className="p-4 sm:p-8 bg-card border border-border rounded-xl sm:rounded-2xl relative overflow-hidden h-full">
                <span className="absolute top-2 right-3 sm:top-4 sm:right-6 font-heading text-4xl sm:text-7xl font-bold text-primary/5">0{i + 1}</span>
                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-5">
                    <p.icon size={20} className="text-primary sm:w-[26px] sm:h-[26px]" />
                  </div>
                  <h3 className="font-heading text-sm sm:text-xl font-bold mb-2 sm:mb-3">{p.title}</h3>
                  <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>

    {/* ═══ 8. OBJETIVOS ═══ */}
    <section className="py-12 sm:py-24 bg-secondary/50">
      <div className="section-container">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Para cada objetivo, um caminho
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">O que você quer conquistar?</h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Conte qual é o seu objetivo e receba um plano personalizado para chegar lá.
          </p>
        </FadeUp>
        <Stagger className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {objectives.map((obj) => (
            <StaggerItem key={obj.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group p-4 sm:p-7 bg-card border border-border rounded-xl sm:rounded-2xl transition-all hover:border-primary/30 hover:shadow-lg h-full"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <obj.icon size={20} className="text-primary sm:w-[26px] sm:h-[26px]" />
                </div>
                <h3 className="font-heading text-sm sm:text-lg font-bold mb-1 sm:mb-2">{obj.title}</h3>
                <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">{obj.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>

    {/* ═══ 9. 3 PASSOS ═══ */}
    <section className="py-12 sm:py-24">
      <div className="section-container">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Simples e direto
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">
            Comece em três etapas
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-14 max-w-xl mx-auto text-sm sm:text-base">
            Sem burocracia. O primeiro passo é solicitar seu diagnóstico gratuito.
          </p>
        </FadeUp>
        <Stagger className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <StaggerItem key={s.number}>
              <div className="text-center relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/20 to-transparent" />
                )}
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 sm:mb-5"
                  whileInView={{ scale: [0.8, 1] }}
                  viewport={{ once: true }}
                >
                  <span className="font-heading text-xl sm:text-2xl font-bold text-primary">{s.number}</span>
                </motion.div>
                <h3 className="font-heading text-base sm:text-lg font-bold mb-2 sm:mb-3">{s.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeUp delay={0.3} className="flex justify-center mt-8 sm:mt-14">
          <ScrollCTA text="Solicitar Diagnóstico Gratuito" />
        </FadeUp>
      </div>
    </section>

    {/* ═══ 10. FORMULÁRIO ═══ */}
    <section className="py-14 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="section-container relative z-10">
        <FadeUp className="text-center mb-8 sm:mb-12">
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block">
            Dê o primeiro passo
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            Solicite seu diagnóstico gratuito
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário e receba uma <strong className="text-foreground">análise personalizada da sua situação financeira</strong> com um plano sob medida.
          </p>
        </FadeUp>
        
        <DiagnosticoForm />
      </div>
    </section>

    {/* ═══ 11. FAQ ═══ */}
    <section className="py-12 sm:py-24">
      <div className="section-container max-w-3xl">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block text-center">
            Dúvidas frequentes
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-14 text-center">
            Perguntas & Respostas
          </h2>
        </FadeUp>
        <Stagger className="space-y-2 sm:space-y-3">
          {faqs.map((faq) => (
            <StaggerItem key={faq.q}>
              <details className="group bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden transition-colors hover:border-primary/20">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer font-heading font-bold text-sm sm:text-base hover:text-primary transition-colors">
                  {faq.q}
                  <ArrowRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-3 sm:ml-4 sm:w-4 sm:h-4" />
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-base text-muted-foreground leading-relaxed">{faq.a}</div>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>

    {/* Social Links */}
    <section className="py-10 sm:py-14">
      <div className="section-container text-center">
        <p className="text-muted-foreground text-sm mb-4">Acompanhe a consultoria nas redes</p>
        <div className="flex justify-center gap-4">
          <a href="https://www.instagram.com/oliveiracapital_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full hover:border-primary/30 transition-colors text-sm font-medium">
            <Instagram size={16} className="text-primary" /> Instagram
          </a>
        </div>
      </div>
    </section>

    {/* ═══ 12. CTA FINAL ═══ */}
    <section className="py-14 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="section-container text-center max-w-2xl relative z-10">
        <FadeUp>
          <span className="text-primary font-heading font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block">
            Não deixe para depois
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            Seu futuro financeiro começa com uma decisão
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground mb-8 sm:mb-10">
            Solicite seu diagnóstico gratuito e dê o primeiro passo rumo a uma vida financeira organizada, sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScrollCTA text="Solicitar Diagnóstico Gratuito" />
          </div>
        </FadeUp>
      </div>
    </section>
  </div>
  );
};

export default Consultoria;
