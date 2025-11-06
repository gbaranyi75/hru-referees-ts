import { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Media = models.Media || model("Media", MediaSchema);

export default Media;
