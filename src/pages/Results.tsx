import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Trophy, Sparkles, ArrowLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { members } from "@/data/members";
import { useVotes } from "@/hooks/useVotes";
import heroBg from "@/assets/hero-bg.jpg";

const SENBATSU_COUNT = 7;

const Results = () => {
  const { getVotes, totalVotes } = useVotes();
  const [phase, setPhase] = useState<"intro" | "revealing" | "complete">("intro");
  const [revealIndex, setRevealIndex] = useState(-1);
  const [tierAnnouncement, setTierAnnouncement] = useState<"none" | "under" | "senbatsu">("none");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announcedRef = useRef<Set<string>>(new Set());

  const rankedMembers = useMemo(() => {
    return [...members].sort((a, b) => getVotes(b.id) - getVotes(a.id));
  }, [getVotes]);

  const senbatsu = rankedMembers.slice(0, SENBATSU_COUNT);
  const underGirls = rankedMembers.slice(SENBATSU_COUNT);

  const revealOrder = useMemo(() => [...rankedMembers].reverse(), [rankedMembers]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const scheduleNext = useCallback((nextIndex: number, delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      advanceReveal(nextIndex);
    }, delay);
  }, []);

  const advanceReveal = useCallback((index: number) => {
    if (index >= rankedMembers.length) {
      setRevealIndex(rankedMembers.length);
      setPhase("complete");
      setTierAnnouncement("none");
      return;
    }

    const currentRank = rankedMembers.length - index;

    // Check if we need a tier announcement before this reveal
    if (currentRank === rankedMembers.length && !announcedRef.current.has("under")) {
      announcedRef.current.add("under");
      setTierAnnouncement("under");
      setRevealIndex(index);
      // Show tier for 2.2s, then start revealing
      scheduleNext(index, 2200);
      return;
    }

    if (currentRank === SENBATSU_COUNT && !announcedRef.current.has("senbatsu")) {
      announcedRef.current.add("senbatsu");
      setTierAnnouncement("senbatsu");
      setRevealIndex(index);
      // Show tier for 2.5s, then start revealing
      scheduleNext(index, 2500);
      return;
    }

    // Normal reveal: show the member and schedule the next one
    setTierAnnouncement("none");
    setRevealIndex(index + 1); // reveal this member (index becomes visible)

    const nextRank = rankedMembers.length - (index + 1);
    const delay = nextRank <= 3 ? 2500 : nextRank <= SENBATSU_COUNT ? 1800 : 1200;
    scheduleNext(index + 1, delay);
  }, [rankedMembers, scheduleNext]);

  const startReveal = useCallback(() => {
    announcedRef.current.clear();
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("revealing");
    setRevealIndex(0);
    setTierAnnouncement("none");
    // Kick off the reveal chain
    setTimeout(() => advanceReveal(0), 100);
  }, [advanceReveal]);

  const skipReveal = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRevealIndex(rankedMembers.length);
    setPhase("complete");
    setTierAnnouncement("none");
  }, [rankedMembers]);

  const getRank = (memberId: string) => rankedMembers.findIndex((m) => m.id === memberId) + 1;

  const isRevealed = (memberId: string) => {
    if (phase === "complete") return true;
    const idx = revealOrder.findIndex((m) => m.id === memberId);
    return idx < revealIndex;
  };

  const currentRevealMember = phase === "revealing" && revealIndex > 0 ? revealOrder[revealIndex - 1] : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
      </div>

      {/* Nav */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar à Votação
        </Link>
      </div>

      {/* INTRO PHASE */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Crown className="w-16 h-16 text-gold mx-auto mb-6 animate-float" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl sm:text-7xl text-gradient tracking-wide"
          >
            RESULTADO FINAL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-lg mt-4 max-w-md"
          >
            {totalVotes} votos foram contabilizados. Prepare-se para a revelação do ranking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-6 mt-8"
          >
            <div className="px-5 py-3 rounded-xl bg-gold/10 border border-gold/20">
              <p className="text-gold font-display text-2xl">{SENBATSU_COUNT}</p>
              <p className="text-xs text-muted-foreground">Senbatsu</p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-primary font-display text-2xl">{members.length - SENBATSU_COUNT}</p>
              <p className="text-xs text-muted-foreground">Under Girls</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startReveal}
            className="mt-12 flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg glow-pink transition-all"
          >
            <Play className="w-5 h-5" />
            Revelar Ranking
          </motion.button>
        </motion.div>
      )}

      {/* TIER ANNOUNCEMENT OVERLAY */}
      <AnimatePresence>
        {tierAnnouncement !== "none" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              {tierAnnouncement === "under" ? (
                <>
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
                  <h2 className="font-display text-5xl sm:text-7xl text-primary tracking-widest">UNDER GIRLS</h2>
                  <p className="text-muted-foreground mt-3 text-lg">Posições {SENBATSU_COUNT + 1} — {members.length}</p>
                </>
              ) : (
                <>
                  <Crown className="w-16 h-16 text-gold mx-auto mb-4 animate-pulse-glow" />
                  <h2 className="font-display text-5xl sm:text-7xl text-gradient tracking-widest">SENBATSU</h2>
                  <p className="text-muted-foreground mt-3 text-lg">As {SENBATSU_COUNT} mais votadas</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEALING / COMPLETE PHASE */}
      {(phase === "revealing" || phase === "complete") && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Current reveal spotlight */}
          <AnimatePresence mode="wait">
            {currentRevealMember && phase === "revealing" && (
              <motion.div
                key={currentRevealMember.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", damping: 20 }}
                className="flex flex-col items-center mb-12"
              >
                <div className={`relative ${getRank(currentRevealMember.id) <= SENBATSU_COUNT ? "glow-gold" : "glow-pink"} rounded-2xl overflow-hidden`}>
                  <img
                    src={currentRevealMember.image}
                    alt={currentRevealMember.name}
                    className="w-40 h-52 sm:w-48 sm:h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-display text-xl mb-1 ${
                      getRank(currentRevealMember.id) <= 3
                        ? "bg-gold text-gold-foreground"
                        : getRank(currentRevealMember.id) <= SENBATSU_COUNT
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {getRank(currentRevealMember.id)}
                    </div>
                    <p className="text-foreground font-semibold text-sm">{currentRevealMember.name}</p>
                    <p className="text-muted-foreground text-xs">{getVotes(currentRevealMember.id)} votos</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SENBATSU SECTION */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-gold" />
              <h2 className="font-display text-3xl text-gradient tracking-wide">SENBATSU</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {senbatsu.map((member, i) => {
                const rank = i + 1;
                const revealed = isRevealed(member.id);
                return (
                  <motion.div
                    key={member.id}
                    initial={false}
                    animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.95 }}
                    className={`relative rounded-xl overflow-hidden border transition-all duration-500 ${
                      revealed
                        ? rank <= 3
                          ? "border-gold/50 glow-gold"
                          : "border-primary/30"
                        : "border-border"
                    }`}
                  >
                    {/* Rank */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full font-display text-sm ${
                        rank === 1
                          ? "bg-gold text-gold-foreground"
                          : rank <= 3
                          ? "bg-gold/80 text-gold-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {rank}
                      </div>
                    </div>

                    {rank === 1 && revealed && (
                      <div className="absolute top-2 right-2 z-10">
                        <Crown className="w-5 h-5 text-gold animate-pulse-glow" />
                      </div>
                    )}

                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          revealed ? "" : "blur-md grayscale"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    </div>

                    <div className="p-2 -mt-8 relative z-10">
                      <p className={`font-semibold text-sm leading-tight transition-opacity ${revealed ? "text-foreground" : "text-transparent"}`}>
                        {revealed ? member.name : "???"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span className="text-xs text-muted-foreground">
                          {revealed ? `${getVotes(member.id)} votos` : "???"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* UNDER GIRLS SECTION */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl text-primary tracking-wide">UNDER GIRLS</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {underGirls.map((member, i) => {
                const rank = SENBATSU_COUNT + i + 1;
                const revealed = isRevealed(member.id);
                return (
                  <motion.div
                    key={member.id}
                    initial={false}
                    animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.95 }}
                    className={`relative rounded-lg overflow-hidden border transition-all duration-500 ${
                      revealed ? "border-primary/20" : "border-border"
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full font-display text-xs bg-muted text-foreground">
                        {rank}
                      </div>
                    </div>

                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          revealed ? "" : "blur-md grayscale"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    </div>

                    <div className="p-2 -mt-6 relative z-10">
                      <p className={`font-semibold text-xs leading-tight ${revealed ? "text-foreground" : "text-transparent"}`}>
                        {revealed ? member.name : "???"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {revealed ? `${getVotes(member.id)} votos` : "???"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Skip / Restart */}
          <div className="flex justify-center mt-12 gap-4">
            {phase === "revealing" && (
              <button
                onClick={() => {
                  setRevealIndex(revealOrder.length);
                  setPhase("complete");
                  setTierAnnouncement("none");
                }}
                className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Pular Revelação
              </button>
            )}
            {phase === "complete" && (
              <button
                onClick={() => {
                  setPhase("intro");
                  setRevealIndex(-1);
                  setTierAnnouncement("none");
                }}
                className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Assistir Novamente
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
