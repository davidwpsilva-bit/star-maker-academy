import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error);
      else setSuccess("Conta criada! Verifique seu email para confirmar.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <Crown className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="font-display text-4xl text-gradient">SOUSENKYO</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isLogin ? "Entre para votar" : "Crie sua conta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-gradient rounded-2xl border border-border p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}
          {success && <p className="text-green-400 text-xs">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:glow-pink transition-all disabled:opacity-50"
          >
            {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {submitting ? "..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>

          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
