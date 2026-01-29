import { Schema, model, models, Model, SchemaDefinition } from "mongoose";

export interface IUser {
  email: string;
  clerkUserId: string;
  username: string;
  image?: string;
  address?: {
    city?: string;
    country?: string;
  };
  phoneNumber?: string;
  hasTitle: string;
  status: string;
  facebookUrl?: string;
  instagramUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
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
  address: {
    city: {
      type: String,
      required: false,
      default: "",
    },
    country: {
      type: String,
      required: false,
      default: "",
    },
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  hasTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  facebookUrl: {
    type: String,
    required: false,
  },
  instagramUrl: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const User = (models.User || model("User", UserSchema)) as unknown as Model<IUser>;

export default User;