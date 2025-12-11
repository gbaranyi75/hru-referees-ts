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
      unique: [true, "Username already exists"],
    },
    image: {
      type: String,
    },
    address:
    {
      city: {
        type: String,
        required: false,
        default: ''
      },
      country: {
        type: String,
        required: false,
        default: ''
      },
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    hasTitle: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    facebookUrl: {
      type: String,
      required: false,
    },
    instagramUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
