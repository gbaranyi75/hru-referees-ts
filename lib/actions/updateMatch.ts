"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { MatchOfficial, NotificationPosition, Match as MatchType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Result } from "@/types/types";
import { createNotifications } from "./notificationActions";

/**
 * Updates an existing match in the database
 * 
 * @param {string | undefined} matchId - The match ID to update
 * @param {Object} data - The new match data
 * @param {string} data.home - Home team name
 * @param {string} data.away - Away team name
 * @param {string} data.type - Match type
 * @param {string} data.gender - Gender (male/female)
 * @param {string} data.age - Age category
 * @param {string} data.venue - Venue
 * @param {MatchOfficial} data.referee - Lead referee
 * @param {MatchOfficial[]} data.referees - List of referees
 * @param {MatchOfficial} data.assist1 - First assistant
 * @param {MatchOfficial} data.assist2 - Second assistant
 * @param {MatchOfficial[]} data.controllers - List of controllers
 * @param {string} data.date - Match date
 * @param {string} data.time - Match time
 * @returns {Promise<Result<null>>} - On success {success: true, data: null}, on error {success: false, error: string}
 * @throws {Error} - If user is not logged in or database error occurs
 * 
 * @example
 * const result = await updateMatch("match123", {
 *   home: "Team A",
 *   away: "Team B - updated",
 *   type: "league",
 *   // ... additional fields
 * });
 * if (result.success) {
 *   console.log("Match successfully updated");
 * }
 */
async function updateMatch(matchId: string | undefined, data: {
  home: string;
  away: string;
  type: string;
  gender: string;
  age: string;
  venue: string;
  referee: MatchOfficial;
  referees: MatchOfficial[];
  assist1: MatchOfficial;
  assist2: MatchOfficial;
  controllers: MatchOfficial[];
  date: string;
  time: string;
}): Promise<Result<null>> {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: 'Not logged in' };
    }

    // Fetch the existing match to compare assignments
    const existingMatch = await Match.findById(matchId).lean().exec() as MatchType | null;
    
    // Helper to get clerkUserId from an official
    const getClerkUserId = (official: MatchOfficial | null | undefined): string | null => {
      return official?.clerkUserId || null;
    };

    // Collect existing assigned clerkUserIds
    const existingAssignments = new Set<string>();
    if (existingMatch) {
      const oldReferee = getClerkUserId(existingMatch.referee);
      const oldAssist1 = getClerkUserId(existingMatch.assist1);
      const oldAssist2 = getClerkUserId(existingMatch.assist2);
      
      if (oldReferee) existingAssignments.add(oldReferee);
      if (oldAssist1) existingAssignments.add(oldAssist1);
      if (oldAssist2) existingAssignments.add(oldAssist2);
      
      (existingMatch.referees || []).forEach((ref) => {
        const id = getClerkUserId(ref);
        if (id) existingAssignments.add(id);
      });
      
      (existingMatch.controllers || []).forEach((ctrl) => {
        const id = getClerkUserId(ctrl);
        if (id) existingAssignments.add(id);
      });
    }

    await Match.findOneAndUpdate(
      { _id: matchId },
      {
        home: data.home,
        away: data.away,
        type: data.type,
        gender: data.gender,
        age: data.age,
        venue: data.venue,
        referee: data.referee,
        referees: data.referees,
        assist1: data.assist1,
        assist2: data.assist2,
        controllers: data.controllers,
        date: data.date,
        time: data.time
      }
    );

    // Send notifications to newly assigned officials only
     const matchInfo =
      data.home && data.away
        ? `${data.home} - ${data.away} (${data.date})`
        : `${data.date}, ${data.type}`;
    const notifications: {
      recipientClerkUserId: string;
      type: "match_assignment";
      position: NotificationPosition;
      matchId: string;
      message: string;
    }[] = [];

    // Helper function to add notification for a new official
    const addNotificationIfNew = (
      official: MatchOfficial,
      position: NotificationPosition,
      positionLabel: string
    ) => {
      if (official?.clerkUserId && !existingAssignments.has(official.clerkUserId)) {
        notifications.push({
          recipientClerkUserId: official.clerkUserId,
          type: "match_assignment",
          position,
          matchId: matchId as string,
           message: `Új küldést kaptál ${positionLabel} poszton a következőre: ${matchInfo}`,
        });
      }
    };

    // Check single referee
    if (data.referee?.clerkUserId) {
      addNotificationIfNew(data.referee, "referee", "játékvezető");
    }

    // Check assistants
    if (data.assist1?.clerkUserId) {
      addNotificationIfNew(data.assist1, "assist1", "asszisztens 1");
    }
    if (data.assist2?.clerkUserId) {
      addNotificationIfNew(data.assist2, "assist2", "asszisztens 2");
    }

    // Check multiple referees
    data.referees?.forEach((ref) => {
      if (ref.clerkUserId) {
        addNotificationIfNew(ref, "referees", "játékvezető");
      }
    });

    // Check controllers
    data.controllers?.forEach((controller) => {
      if (controller.clerkUserId) {
        addNotificationIfNew(controller, "controller", "ellenőr");
      }
    });

    // Create all notifications in batch
    if (notifications.length > 0) {
      const notificationResult = await createNotifications(notifications);
      if (!notificationResult?.success) {
        console.warn("Failed to create notifications for updated match", {
          matchId,
          error: notificationResult?.error,
        });
      }
    }

    revalidatePath('/dashboard/matches');
    return { success: true, data: null };
  } catch (error) {
    console.error('Error updating match:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error updating match' 
    };
  }
}

export default updateMatch;
