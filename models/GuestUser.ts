import { Schema, model, models } from "mongoose";

const GuestUserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: [true, "Username already exists"],
        },
        address:
        {
            country: {
                type: String,
                required: true
            },
        },
        status: {
            type: String,
            required: true
        },
        isGuest: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const GuestUser = models.GuestUser || model("GuestUser", GuestUserSchema);

export default GuestUser;
