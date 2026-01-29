import { Schema, model, models, Model } from "mongoose";

// Opcionális, de erősen ajánlott: definiáljunk egy interfészt a felhasználóhoz
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

const UserSchema = new Schema<IUser>(
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
  },
  {
    timestamps: true,
  },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;
