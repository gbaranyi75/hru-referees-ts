import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "@/lib/actions/createMatch";
import { fetchMatches } from "@/lib/actions/fetchMatches";

/**
 * Hook for fetching matches using server action
 */
export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const result = await fetchMatches();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook for creating a new match using server action
 */
export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}