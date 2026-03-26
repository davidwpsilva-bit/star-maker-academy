import { useState, useCallback } from "react";

const STORAGE_KEY = "idol-votes";
const VOTED_KEY = "idol-voted-members";

export function useVotes() {
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [votedMembers, setVotedMembers] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(VOTED_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const vote = useCallback((memberId: string) => {
    if (votedMembers.has(memberId)) return;

    setVotes((prev) => {
      const updated = { ...prev, [memberId]: (prev[memberId] || 0) + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setVotedMembers((prev) => {
      const updated = new Set(prev);
      updated.add(memberId);
      localStorage.setItem(VOTED_KEY, JSON.stringify([...updated]));
      return updated;
    });
  }, [votedMembers]);

  const getVotes = useCallback((memberId: string) => votes[memberId] || 0, [votes]);
  const hasVoted = useCallback((memberId: string) => votedMembers.has(memberId), [votedMembers]);
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return { vote, getVotes, hasVoted, totalVotes };
}
