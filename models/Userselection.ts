import { Schema, model, models } from "mongoose";

const UserSelectionSchema = new Schema(
  {
    calendarName: {
      type: String,
      required: true,
    },
    calendarId: {
      type: String,
      required: true,
    },
    selectedDays: [
      {
        type: String,
      },
    ],
    username: {
      type: String,
      required: true,
    },
    clerkUserId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSelectionSchema.index({ clerkUserId: 1, calendarId: 1 }, { unique: true });

const UserSelection =
  models.UserSelection || model("UserSelection", UserSelectionSchema);

export default UserSelection;
