import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, Calendar, Users, Mic } from "lucide-react";
import type { Member } from "@/data/members";

interface MemberModalProps {
  member: Member | null;
  votes: number;
  hasVoted: boolean;
  rank: number;
  onVote: (id: string) => void;
  onClose: () => void;
}

export function MemberModal({ member, votes, hasVoted, rank, onVote, onClose }: MemberModalProps) {
  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg card-gradient rounded-2xl border border-border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-muted/80 text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            
            {/* Rank */}
            <div className="absolute bottom-4 left-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-display text-2xl ${
                rank <= 3 ? "bg-gold text-gold-foreground glow-gold" : "bg-muted text-foreground"
              }`}>
                {rank}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 -mt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
                <p className="text-lg text-muted-foreground">{member.nameJp}</p>
              </div>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                {member.team}
              </span>
            </div>

            <p className="mt-3 text-muted-foreground italic">"{member.motto}"</p>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Idade</span>
                <span className="text-foreground font-semibold">{member.age}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Mic className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Posição</span>
                <span className="text-foreground font-semibold text-xs text-center">{member.position}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                <Star className="w-4 h-4 text-gold fill-gold mb-1" />
                <span className="text-xs text-muted-foreground">Votos</span>
                <span className="text-foreground font-semibold">{votes}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Nascimento: {new Date(member.birthdate).toLocaleDateString("pt-BR")}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onVote(member.id)}
              disabled={hasVoted}
              className={`w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-lg transition-all ${
                hasVoted
                  ? "bg-primary/20 text-primary cursor-default"
                  : "bg-primary text-primary-foreground hover:glow-pink"
              }`}
            >
              <Heart className={`w-5 h-5 ${hasVoted ? "fill-primary" : ""}`} />
              {hasVoted ? "Já Votou ✓" : "Votar Nesta Membro"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
