"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { MatchOfficial } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
}) => {
  await connectDB();
  const user = await currentUser();
  if (!user) {
    return { error: "You must be logged in to create a match" };
  }
  try {
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
    revalidatePath("/dashboard/matches")
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
