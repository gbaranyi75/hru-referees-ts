import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { createNewCalendar } from "@/lib/actions/createCalendar";
import { updateCalendar } from "@/lib/actions/updateCalendar";
import { deleteCalendar } from "@/lib/actions/deleteCalendar";
import { Calendar } from "@/types/models";

/**
 * Hook for fetching calendars using server action
 */
export function useCalendars() {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: async () => {
      const result = await fetchCalendars();
      if (!result.success) {
        throw new Error(result.error);
      }
      // Sort by first day descending (Safari-safe date parsing)
      return result.data.sort((a: Calendar, b: Calendar) => {
        const dateA = a.days?.[0] ? new Date(a.days[0]).getTime() : 0;
        const dateB = b.days?.[0] ? new Date(b.days[0]).getTime() : 0;
        return dateB - dateA;
      });
    },
  });
}

/**
 * Hook for creating a new calendar using server action
 */
export function useCreateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}

/**
 * Hook for updating a calendar using server action
 */
export function useUpdateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      calendarId,
      data,
    }: {
      calendarId: string | undefined;
      data: { name: string; days: string[] };
    }) => updateCalendar(calendarId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}

/**
 * Hook for deleting a calendar using server action
 */
export function useDeleteCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
}
