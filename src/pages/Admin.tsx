import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Crown, Shield, ArrowLeft, Star, Users, Heart, LogOut } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { members } from "@/data/members";
import heroBg from "@/assets/hero-bg.jpg";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [loadingVotes, setLoadingVotes] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase.rpc("get_vote_counts");
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((row) => { counts[row.member_id] = Number(row.vote_count); });
        setVoteCounts(counts);
      }
      setLoadingVotes(false);
    };
    load();
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const rankedMembers = [...members].sort(
    (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
  );

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const SENBATSU_COUNT = 7;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Painel Admin
          </div>
          <h1 className="font-display text-5xl text-gradient">RESULTADOS</h1>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-semibold">{members.length}</span>
              <span className="text-xs text-muted-foreground">membros</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-foreground font-semibold">{totalVotes}</span>
              <span className="text-xs text-muted-foreground">votos</span>
            </div>
          </div>
        </div>

        {loadingVotes ? (
          <p className="text-center text-muted-foreground">Carregando votos...</p>
        ) : (
          <div className="space-y-2">
            {rankedMembers.map((member, i) => {
              const rank = i + 1;
              const votes = voteCounts[member.id] || 0;
              const maxVotes = Math.max(...Object.values(voteCounts), 1);
              const pct = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0.0";

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    rank <= 3
                      ? "border-gold/30 card-gradient"
                      : rank <= SENBATSU_COUNT
                      ? "border-primary/20 card-gradient"
                      : "border-border bg-muted/20"
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full font-display text-lg flex-shrink-0 ${
                    rank === 1
                      ? "bg-gold text-gold-foreground"
                      : rank <= 3
                      ? "bg-gold/70 text-gold-foreground"
                      : rank <= SENBATSU_COUNT
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {rank}
                  </div>

                  {/* Photo */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold text-sm truncate">{member.name}</span>
                      {rank <= SENBATSU_COUNT && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gold/20 text-gold">Senbatsu</span>
                      )}
                    </div>
                    {/* Bar */}
                    <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(votes / maxVotes) * 100}%` }}
                        transition={{ delay: i * 0.03 + 0.3, duration: 0.6 }}
                        className={`h-full rounded-full ${rank <= 3 ? "bg-gold" : rank <= SENBATSU_COUNT ? "bg-primary" : "bg-muted-foreground/50"}`}
                      />
                    </div>
                  </div>

                  {/* Votes */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                      <span className="text-foreground font-semibold text-sm">{votes}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
