import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    try {
      await api.post("/contact", {
        name: "Newsletter",
        email: email.trim(),
        subject: "Inscrição Newsletter",
        message: "Inscrição via newsletter do site.",
        source: "newsletter",
      });
      toast({ title: "Inscrito com sucesso! 🎉", description: "Você receberá nossos conteúdos." });
      setEmail("");
    } catch (err: any) {
      toast({ title: "Erro ao inscrever", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <section className="newsletter-section">
      <div className="section-container text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
          Receba insights exclusivos.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Junte-se a milhares de leitores que recebem minhas estratégias e análises diretamente na caixa de entrada.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium text-sm rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {sending ? "Enviando..." : "Inscrever-se"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
