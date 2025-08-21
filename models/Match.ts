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
      userName: {
        type: String,
      },
      userId: {
        type: String,
      },
    },
    referees: [
      {
        userName: {
          type: String,
        },
        userId: {
          type: String,
        },
      },
    ],
    assist1: {
      userName: {
        type: String,
      },
      userId: {
        type: String,
      },
    },
    assist2: {
      userName: {
        type: String,
      },
      userId: {
        type: String,
      },
    },
    controllers: [
      {
        userName: {
          type: String,
        },
        userId: {
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
