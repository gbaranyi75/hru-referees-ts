import { Schema, model, models } from "mongoose";

const MatchSchema = new Schema(
  {
    home: {
      type: String,
    },
    away: { type: String },
    type: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    venue: { type: String, required: true },
    referee: {
      username: {
        type: String,
      },
      clerkUserId: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    referees: [
      {
        username: {
          type: String,
        },
        clerkUserId: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    assist1: {
      username: {
        type: String,
      },
      clerkUserId: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    assist2: {
      username: {
        type: String,
      },
      clerkUserId: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    controllers: [
      {
        username: {
          type: String,
        },
        clerkUserId: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Match = models.Match || model("Match", MatchSchema);

export default Match;
