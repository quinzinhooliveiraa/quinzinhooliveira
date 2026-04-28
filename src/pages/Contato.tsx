import { useRef, useState } from "react";
import { Mail, Instagram, Youtube, Linkedin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { AdminEditableLink } from "@/components/admin/AdminEditableLink";

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

const Contato = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await api.post("/contact", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || null,
        message: message.trim(),
        source: "contato",
      });
      toast({ title: "Mensagem enviada! ✉️", description: "Responderei em breve." });
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <div className="pt-16">
      <SEO
        title="Contato"
        description="Entre em contato com Quinzinho Oliveira. Envie sua mensagem para parcerias, projetos, consultoria ou qualquer outra dúvida."
      />
      <section className="py-16 sm:py-20">
        <div className="section-container max-w-2xl">
          <FadeUp>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Contato<span className="text-primary">.</span></h1>
            <p className="text-muted-foreground mb-10 sm:mb-12 text-sm sm:text-base">
              Tem alguma proposta, dúvida ou quer trabalhar comigo? Entre em contato.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4 mb-12 sm:mb-16">
              <div className="grid sm:grid-cols-2 gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome *" className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail *" type="email" className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow" />
              </div>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto" className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow" />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensagem *" rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-shadow" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Enviar Mensagem"}
              </motion.button>
            </form>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold mb-4">Redes Sociais</h2>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  { icon: Instagram, label: "Instagram", key: "contato_social_instagram", href: "https://www.instagram.com/quinzinhooliveiraa_/" },
                  { icon: Youtube, label: "YouTube", key: "contato_social_youtube", href: "https://www.youtube.com/@quinzinhooliveira" },
                  { icon: Linkedin, label: "LinkedIn", key: "contato_social_linkedin", href: "https://www.linkedin.com/in/joaquim-emmanuel-oliveira/" },
                  { icon: Mail, label: "Email", key: "contato_social_email", href: "mailto:quinzinhooliveiraa@gmail.com" },
                ].map(({ icon: Icon, label, key, href }) => (
                  <AdminEditableLink
                    key={label}
                    settingKey={key}
                    defaultHref={href}
                    external={href.startsWith("http") || href.startsWith("mailto:")}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground transition-colors hover:text-primary hover:border-primary"
                  >
                    <Icon size={16} /> {label}
                  </AdminEditableLink>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};

export default Contato;
