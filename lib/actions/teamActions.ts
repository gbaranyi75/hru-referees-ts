'use server'

import connectDB from "@/config/database";
import Team from "@/models/Team";
import { Result, Team as TeamType } from "@/types/types";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";

/**
 * Fetches teams from the database
 * @returns {Promise<Result<TeamType[]>>} A promise that resolves to a result object containing the teams or an error message
 */

export const fetchTeams = async (): Promise<Result<TeamType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const teams = await Team.find().lean();
    return JSON.parse(JSON.stringify(teams));
  });
};

/**
 * Creates a new team in the database
 * @param {TeamType} teamData - The data for the new team
 * @returns {Promise<Result<TeamType>>} A promise that resolves to a result object containing the created team or an error message
 */
export const createTeam = async (teamData: TeamType): Promise<Result<TeamType>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const newTeam = new Team(teamData);
    await newTeam.save();
    return JSON.parse(JSON.stringify(newTeam));
  });
};

/**
 * Updates an existing team in the database
 * @param {string|undefined} teamId - The ID of the team to update
 * @param {string} name - The name of the team
 * @param {string} [city] - The city of the team (optional)
 * @param {string} [teamLeader] - The team leader's name (optional)
 * @param {string} [phone] - The phone number (optional)
 * @param {string} [email] - The email address (optional)
 * @returns {Promise<Result<TeamType>>} A promise that resolves to a result object containing the updated team or an error message
 */
export const updateTeam = async (teamId: string | undefined, name: string, city?: string, teamLeader?: string, phone?: string, email?: string): Promise<Result<TeamType>> => {
  return handleAsyncOperation(async () => {
    if (!teamId) {
      throw new Error("A csapat azonosító megadása kötelező");
    }
    await connectDB();
    
    const updateData: Partial<Pick<TeamType, "name" | "city" | "teamLeader" | "phone" | "email">> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (city !== undefined) {
      updateData.city = city;
    }
    if (teamLeader !== undefined) {
      updateData.teamLeader = teamLeader;
    }
    if (phone !== undefined) {
      updateData.phone = phone;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    
    const updatedTeam = await Team.findByIdAndUpdate(teamId, updateData, { new: true }).lean();
    if (!updatedTeam) {
      throw new Error("A csapat nem található");
    }
    return JSON.parse(JSON.stringify(updatedTeam));
  });
};

/**
 * Deletes a team from the database
 * @param {string} teamId - The ID of the team to delete
 * @returns {Promise<Result<TeamType>>} A promise that resolves to a result object containing the deleted team or an error message
 */
export const deleteTeam = async (teamId: string): Promise<Result<TeamType>> => {
  return handleAsyncOperation(async () => {
    if (!teamId) {
      throw new Error("A csapat azonosító megadása kötelező");
    }
    await connectDB();
    const deletedTeam = await Team.findByIdAndDelete(teamId).lean();
    if (!deletedTeam) {
      throw new Error("A csapat nem található vagy már törölve lett");
    }
    return JSON.parse(JSON.stringify(deletedTeam));
  });
};
