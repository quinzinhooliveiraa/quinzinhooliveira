import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot", { email });
      if (res?.token) setResetToken(res.token);
      setSent(true);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Redefinir senha</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent ? "Use o link abaixo para redefinir" : "Insira seu e-mail para gerar um link"}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Se o e-mail estiver cadastrado, abaixo está o link de redefinição.
            </p>
            {resetToken && (
              <Link
                to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                className="inline-block w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Abrir link de redefinição
              </Link>
            )}
            <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft size={14} /> Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Gerando..." : "Gerar link"}
            </Button>
            <div className="text-center">
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
                Voltar ao login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
