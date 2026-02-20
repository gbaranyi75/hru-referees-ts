import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
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
    },
);

const Team = models.Team || model("Team", TeamSchema);

export default Team;
