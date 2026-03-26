import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import type { Member } from "@/data/members";

interface MemberCardProps {
  member: Member;
  rank: number;
  votes: number;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onSelect: (member: Member) => void;
}

export function MemberCard({ member, rank, votes, hasVoted, onVote, onSelect }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="group relative card-gradient rounded-xl border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300"
      onClick={() => onSelect(member)}
    >
      {/* Rank badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-display text-lg ${
          rank <= 3 ? "bg-gold text-gold-foreground glow-gold" : "bg-muted text-foreground"
        }`}>
          {rank}
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          width={512}
          height={640}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Team badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
            {member.team}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 -mt-12 relative z-10">
        <p className="text-xs text-muted-foreground font-medium">{member.position}</p>
        <h3 className="text-foreground font-semibold text-lg leading-tight mt-1">{member.name}</h3>
        <p className="text-muted-foreground text-sm">{member.nameJp}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-foreground font-semibold text-sm animate-count-up">{votes}</span>
            <span className="text-muted-foreground text-xs">votos</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onVote(member.id);
            }}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              hasVoted
                ? "bg-primary/20 text-primary cursor-default"
                : "bg-primary text-primary-foreground hover:glow-pink active:scale-95"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasVoted ? "fill-primary" : ""}`} />
            {hasVoted ? "Votado" : "Votar"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
