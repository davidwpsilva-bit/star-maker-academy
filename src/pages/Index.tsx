import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Crown, Heart, Users, Trophy, Sparkles, LogOut, Shield } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { members, type Member } from "@/data/members";
import { MemberCard } from "@/components/MemberCard";
import { MemberModal } from "@/components/MemberModal";
import { useVotes } from "@/hooks/useVotes";
import { useAuth } from "@/hooks/useAuth";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { vote, hasVoted, totalVotes } = useVotes();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [filter, setFilter] = useState<"all" | "Team A" | "Team B">("all");

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const filteredMembers = filter === "all" ? members : members.filter((m) => m.team === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Votação Aberta
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl sm:text-8xl tracking-wide text-gradient leading-none"
          >
            SOUSENKYO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mt-3 max-w-md mx-auto"
          >
            Escolha sua membro favorita. Seu voto decide o ranking final.
          </motion.p>

          {/* Stats - only total votes, no individual counts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-gold">
                <Trophy className="w-5 h-5" />
                <span className="font-display text-3xl">{members.length}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">Membros</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-primary">
                <Heart className="w-5 h-5" />
                <span className="font-display text-3xl">{totalVotes}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">Votos Totais</span>
            </div>
          </motion.div>

          {isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold font-medium text-sm hover:bg-gold/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Ver Resultado (Admin)
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-2">
          {(["all", "Team A", "Team B"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Member Grid - no vote counts shown */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMembers.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              rank={i + 1}
              votes={0}
              hasVoted={hasVoted(member.id)}
              onVote={vote}
              onSelect={setSelectedMember}
              hideVotes
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          votes={0}
          hasVoted={hasVoted(selectedMember.id)}
          rank={0}
          onVote={vote}
          onClose={() => setSelectedMember(null)}
          hideVotes
        />
      )}
    </div>
  );
};

export default Index;
