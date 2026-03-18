'use server'

import connectDB from "@/config/database";
import Team from "@/models/Team";
import { Team as TeamType } from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { ErrorMessages } from "@/constants/messages";

const slugifyTeamName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    // Keep unicode letters/numbers so Hungarian diacritics stay in the slug
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/\-+/g, "-")
    .replace(/^\-|\-$/g, "");

/**
 * Fetches teams from the database
 * @returns {Promise<Result<TeamType[]>>} A promise that resolves to a result object containing the teams or an error message
 */

export const fetchTeams = async (): Promise<ActionResult<TeamType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const teams = await Team.find().lean();
    return JSON.parse(JSON.stringify(teams));
  });
};

export const fetchTeamsByCompetition = async (
  competition: "NB_I" | "EXTRA_LIGA" | "INTERNATIONAL"
): Promise<ActionResult<TeamType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const teams = await Team.find({
      competitions: { $in: [competition] },
    })
      .sort({ name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(teams));
  });
};

/**
 * Creates a new team in the database
 * @param {TeamType} teamData - The data for the new team
 * @returns {Promise<Result<TeamType>>} A promise that resolves to a result object containing the created team or an error message
 */
export const createTeam = async (teamData: TeamType): Promise<ActionResult<TeamType>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const slugBase = teamData.slug?.trim() || slugifyTeamName(teamData.name);
    const teamPayload: TeamType = {
      ...teamData,
      slug: slugBase || undefined,
      kind: teamData.kind ?? "club",
      competitions: teamData.competitions ?? [],
      aliases: teamData.aliases ?? [],
    };
    const newTeam = new Team(teamPayload);
    await newTeam.save();
    return JSON.parse(JSON.stringify(newTeam));
  });
};

/**
 * Updates an existing team in the database
 */
export const updateTeam = async (
  teamId: string | undefined,
  updates: Partial<TeamType>
): Promise<ActionResult<TeamType>> => {
  return handleAsyncOperation(async () => {
    if (!teamId) {
      throw new Error(ErrorMessages.TEAM.ID_REQUIRED);
    }
    await connectDB();
    
    const updateData: Partial<TeamType> = { ...updates };
    if (updateData.name !== undefined) updateData.name = updateData.name.trim();
    if (updateData.slug !== undefined) updateData.slug = updateData.slug.trim().toLowerCase();
    if (updateData.kind !== undefined && !["club", "country"].includes(updateData.kind)) {
      throw new Error("Invalid team kind");
    }
    if (updateData.competitions !== undefined && !Array.isArray(updateData.competitions)) {
      throw new Error("Invalid competitions");
    }
    
    const updatedTeam = await Team.findByIdAndUpdate(teamId, updateData, { new: true }).lean();
    if (!updatedTeam) {
      throw new Error(ErrorMessages.TEAM.NOT_FOUND);
    }
    return JSON.parse(JSON.stringify(updatedTeam));
  });
};

/**
 * Deletes a team from the database
 * @param {string} teamId - The ID of the team to delete
 * @returns {Promise<Result<TeamType>>} A promise that resolves to a result object containing the deleted team or an error message
 */
export const deleteTeam = async (teamId: string): Promise<ActionResult<TeamType>> => {
  return handleAsyncOperation(async () => {
    if (!teamId) {
      throw new Error(ErrorMessages.TEAM.ID_REQUIRED);
    }
    await connectDB();
    const deletedTeam = await Team.findByIdAndDelete(teamId).lean();
    if (!deletedTeam) {
      throw new Error(ErrorMessages.TEAM.NOT_FOUND_OR_DELETED);
    }
    return JSON.parse(JSON.stringify(deletedTeam));
  });
};
