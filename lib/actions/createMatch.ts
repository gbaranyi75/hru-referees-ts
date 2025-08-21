"use server";
import connectDB from "@/config/database";
import Match from "@/models/Match";
import { currentUser } from "@clerk/nextjs/server";

export const createMatch = async (data: {
  home: string;
  away: string;
  type: string;
  gender: string;
  age: string;
  venue: string;
  referee: string;
  referees: string[];
  assist1: string;
  assist2: string;
  controllers: string[];
  date: Date;
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
    return { submitted: true };
  } catch (error) {
    console.error(error);
    return new Error(error instanceof Error ? error.message : String(error));
  }
};
