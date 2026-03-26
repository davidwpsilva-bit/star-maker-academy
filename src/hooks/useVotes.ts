import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useVotes() {
  const { user } = useAuth();
  const [votedMembers, setVotedMembers] = useState<Set<string>>(new Set());
  const [totalVotes, setTotalVotes] = useState(0);

  // Load user's own votes and total count
  useEffect(() => {
    const loadVotes = async () => {
      // Get total votes (public function)
      const { data: total } = await supabase.rpc("get_total_votes");
      setTotalVotes(Number(total) || 0);

      // Get user's own votes
      if (user) {
        const { data } = await supabase.from("votes").select("member_id").eq("user_id", user.id);
        if (data) {
          setVotedMembers(new Set(data.map((v) => v.member_id)));
        }
      }
    };
    loadVotes();
  }, [user]);

  const vote = useCallback(async (memberId: string) => {
    if (!user || votedMembers.has(memberId)) return;

    const { error } = await supabase.from("votes").insert({ user_id: user.id, member_id: memberId });
    if (!error) {
      setVotedMembers((prev) => {
        const updated = new Set(prev);
        updated.add(memberId);
        return updated;
      });
      setTotalVotes((prev) => prev + 1);
    }
  }, [user, votedMembers]);

  const hasVoted = useCallback((memberId: string) => votedMembers.has(memberId), [votedMembers]);

  return { vote, hasVoted, totalVotes };
}
