import { Schema, model, models } from "mongoose";

export const TEAM_COMPETITIONS = [
  "NB_I",
  "EXTRA_LIGA",
  "INTERNATIONAL",
] as const;

export const TEAM_KINDS = ["club", "country"] as const;

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    kind: {
      type: String,
      required: true,
      enum: TEAM_KINDS,
      default: "club",
    },
    competitions: {
      type: [String],
      required: true,
      default: [],
      enum: TEAM_COMPETITIONS,
    },
    countryCode: {
      type: String,
      required: false,
      trim: true,
      uppercase: true,
    },
    aliases: {
      type: [String],
      required: true,
      default: [],
    },
    city: {
      type: String,
      required: false,
    },
    teamLeader: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ kind: 1, competitions: 1 });

const Team = models.Team || model("Team", TeamSchema);

export default Team;
