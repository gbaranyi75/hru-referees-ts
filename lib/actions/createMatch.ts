"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { MatchOfficial } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Result } from "@/types/types";

/**
 * Creates a new match in the database
 * 
 * @param {Object} data - Match data
 * @param {string} data.home - Home team name
 * @param {string} data.away - Away team name
 * @param {string} data.type - Match type (league, cup, etc.)
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
 * const result = await createMatch({
 *   home: "Team A",
 *   away: "Team B",
 *   type: "league",
 *   gender: "male",
 *   age: "senior",
 *   venue: "Stadium",
 *   referee: { name: "John Doe", id: "123" },
 *   referees: [],
 *   assist1: { name: "Peter Smith", id: "456" },
 *   assist2: { name: "Steve Johnson", id: "789" },
 *   controllers: [],
 *   date: "2024-03-15",
 *   time: "18:00"
 * });
 * if (result.success) {
 *   console.log("Match successfully created");
 * }
 */
export const createMatch = async (data: {
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
}): Promise<Result<null>> => {
  try {
    await connectDB();
    const user = await currentUser();
    
    if (!user) {
      return { success: false, error: 'Not logged in' };
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
    revalidatePath("/dashboard/matches");
    return { success: true, data: null };
  } catch (error) {
    console.error('Error creating match:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error creating match' 
    };
  }
};
