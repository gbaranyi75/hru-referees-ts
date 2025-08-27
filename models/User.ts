import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    clerkUserId: {
      type: String,
      unique: true,
      required: [true, "ClerkUserId is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    image: {
      type: String,
    },
    facebookUrl: {
      type: String,
      required: false,
      unique: true,
    },
    instagramUrl: {
      type: String,
      required: false,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
    },
    address:
    {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
