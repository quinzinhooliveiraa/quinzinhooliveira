import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="newsletter-section">
      <div className="section-container text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
          Receba insights exclusivos.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Junte-se a milhares de leitores que recebem minhas estratégias e análises diretamente na caixa de entrada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-6 py-3 bg-primary text-primary-foreground font-medium text-sm rounded-lg transition-opacity hover:opacity-90">
            Inscrever-se
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
