import { Schema, model, models } from "mongoose";
export interface NotificationDocument extends Document {
  recipientClerkUserId: string;
  type: "match_assignment" | "match_removal" | "new_registration";
  position?: string;
  matchId?: string;
  message: string;
  read: boolean;
  readAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Notification schema for storing user notifications
 * Used to notify referees when they are assigned to matches
 */
const NotificationSchema = new Schema(
  {
    /** The Clerk user ID of the notification recipient */
    recipientClerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    /** Type of notification: match_assignment, match_removal, new_registration */
    type: {
      type: String,
      required: true,
      enum: ["match_assignment", "match_removal", "new_registration"],
    },
    /** Position the user was assigned to */
    position: {
      type: String,
      enum: ["referee", "assist1", "assist2", "controller", "referees"],
      required: function (this: { type: string }) {
        return this.type === "match_assignment" || this.type === "match_removal";
      },
    },
    /** Reference to the match */
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: function (this: { type: string }) {
        return this.type === "match_assignment" || this.type === "match_removal";
      },
    },
    /** Human-readable notification message */
    message: {
      type: String,
      required: true,
    },
    /** Whether the notification has been read */
    read: {
      type: Boolean,
      default: false,
    },
    /** When the notification was read */
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for fetching user's unread notifications sorted by date
NotificationSchema.index(
  { recipientClerkUserId: 1, read: 1, createdAt: -1 }
);

const Notification = (models.Notification || model("Notification", NotificationSchema));

export default Notification;
