"use server";

import connectDB from "@/config/database";
import Match from "@/models/Match";
import {
  Match as MatchType,
  MatchOfficial,
  NotificationPosition,
} from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { Types, PipelineStage } from "mongoose";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createNotifications } from "./notificationActions";

interface IFetchMatchesProps {
  limit?: number;
  skip?: number;
  sortOrder?: "asc" | "desc";
  dateFilter?: "upcoming" | "past";
}

/**
 * Fetches matches from the database with pagination
 */
export const fetchMatches = async ({
  limit = 0,
  skip = 0,
  sortOrder = "desc",
  dateFilter,
}: IFetchMatchesProps = {}): Promise<ActionResult<MatchType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          dateParsed: {
            $ifNull: [
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y. %m. %d.",
                  onError: null,
                  onNull: null,
                },
              },
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y.%m.%d.",
                  onError: null,
                  onNull: null,
                },
              },
            ],
          },
        },
      },
    ];

    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      pipeline.push({
        $match: {
          dateParsed:
            dateFilter === "upcoming" ? { $gte: today } : { $lt: today },
        },
      } as PipelineStage);
    }

    pipeline.push({
      $sort: { dateParsed: sortOrder === "asc" ? 1 : -1 },
    } as PipelineStage);

    if (skip > 0) {
      pipeline.push({ $skip: skip } as PipelineStage);
    }

    if (limit > 0) {
      pipeline.push({ $limit: limit } as PipelineStage);
    }

    const matches = await Match.aggregate(pipeline).exec();

    return JSON.parse(JSON.stringify(matches));
  }, "Error fetching matches");
};

export const fetchMatchesCount = async (
  dateFilter?: "upcoming" | "past"
): Promise<number> => {
  await connectDB();
  try {
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          dateParsed: {
            $ifNull: [
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y. %m. %d.",
                  onError: null,
                  onNull: null,
                },
              },
              {
                $dateFromString: {
                  dateString: "$date",
                  format: "%Y.%m.%d.",
                  onError: null,
                  onNull: null,
                },
              },
            ],
          },
        },
      },
    ];

    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      pipeline.push({
        $match: {
          dateParsed:
            dateFilter === "upcoming" ? { $gte: today } : { $lt: today },
        },
      } as PipelineStage);
    }

    pipeline.push({ $count: "count" } as PipelineStage);

    const result = await Match.aggregate(pipeline).exec();
    return result?.[0]?.count ?? 0;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error fetching matches count: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error }
    );
  }
};

/**
 * Fetches a single match by its ID
 */
export const fetchMatchById = async (
  matchId: string
): Promise<ActionResult<MatchType | null>> => {
  return handleAsyncOperation(async () => {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new Error("Invalid match ID format");
    }

    await connectDB();
    const match = await Match.findById(matchId).lean().exec();
    return match ? JSON.parse(JSON.stringify(match)) : null;
  }, "Error fetching match by ID");
};

export interface MatchData {
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
}

/**
 * Creates a new match in the database
 */
export const createMatch = async (data: MatchData): Promise<ActionResult<null>> => {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const newMatch = new Match({
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
      time: data.time,
    });
    await newMatch.save();

    const matchId = newMatch._id.toString();
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

    const addNotification = (
      official: MatchOfficial,
      position: NotificationPosition,
      positionLabel: string
    ) => {
      if (official?.clerkUserId) {
        notifications.push({
          recipientClerkUserId: official.clerkUserId,
          type: "match_assignment",
          position,
          matchId,
          message: `Új küldést kaptál ${positionLabel} poszton a következőre: ${matchInfo}`,
        });
      }
    };

    if (data.referee?.clerkUserId) {
      addNotification(data.referee, "referee", "játékvezető");
    }
    if (data.assist1?.clerkUserId) {
      addNotification(data.assist1, "assist1", "asszisztens 1");
    }
    if (data.assist2?.clerkUserId) {
      addNotification(data.assist2, "assist2", "asszisztens 2");
    }
    data.referees?.forEach((ref) => {
      if (ref.clerkUserId) {
        addNotification(ref, "referees", "játékvezető");
      }
    });
    data.controllers?.forEach((controller) => {
      if (controller.clerkUserId) {
        addNotification(controller, "controller", "ellenőr");
      }
    });

    if (notifications.length > 0) {
      const notificationResult = await createNotifications(notifications);
      if (!notificationResult?.success) {
        console.warn("Failed to create notifications for new match", {
          matchId,
          error: notificationResult?.error,
        });
      }
    }

    revalidatePath("/dashboard/matches");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error creating match:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating match",
    };
  }
};

/**
 * Updates an existing match in the database
 */
export const updateMatch = async (
  matchId: string | undefined,
  data: MatchData
): Promise<ActionResult<null>> => {
  try {
    await connectDB();
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Not logged in" };
    }

    const existingMatch = (await Match.findById(matchId)
      .lean()
      .exec()) as MatchType | null;

    const getClerkUserId = (
      official: MatchOfficial | null | undefined
    ): string | null => {
      return official?.clerkUserId || null;
    };

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
        time: data.time,
      }
    );

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

    const addNotificationIfNew = (
      official: MatchOfficial,
      position: NotificationPosition,
      positionLabel: string
    ) => {
      if (
        official?.clerkUserId &&
        !existingAssignments.has(official.clerkUserId)
      ) {
        notifications.push({
          recipientClerkUserId: official.clerkUserId,
          type: "match_assignment",
          position,
          matchId: matchId as string,
          message: `Új küldést kaptál ${positionLabel} poszton a következőre: ${matchInfo}`,
        });
      }
    };

    if (data.referee?.clerkUserId) {
      addNotificationIfNew(data.referee, "referee", "játékvezető");
    }
    if (data.assist1?.clerkUserId) {
      addNotificationIfNew(data.assist1, "assist1", "asszisztens 1");
    }
    if (data.assist2?.clerkUserId) {
      addNotificationIfNew(data.assist2, "assist2", "asszisztens 2");
    }
    data.referees?.forEach((ref) => {
      if (ref.clerkUserId) {
        addNotificationIfNew(ref, "referees", "játékvezető");
      }
    });
    data.controllers?.forEach((controller) => {
      if (controller.clerkUserId) {
        addNotificationIfNew(controller, "controller", "ellenőr");
      }
    });

    if (notifications.length > 0) {
      const notificationResult = await createNotifications(notifications);
      if (!notificationResult?.success) {
        console.warn("Failed to create notifications for updated match", {
          matchId,
          error: notificationResult?.error,
        });
      }
    }

    revalidatePath("/dashboard/matches");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error updating match:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating match",
    };
  }
};
