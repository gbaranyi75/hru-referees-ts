"use server";
import connectDB from "@/config/database";
import Notification from "@/models/Notification";
import {
  Notification as NotificationType,
  NotificationPosition,
} from "@/types/models";
import { ActionResult } from "@/types/result";
import { handleAsyncOperation } from "@/lib/utils/errorHandling";
import { currentUser } from "@clerk/nextjs/server";

interface CreateNotificationParams {
  recipientClerkUserId: string;
  type: "match_assignment" | "match_removal" | "new_registration";
  position?: NotificationPosition | "admin";
  matchId?: string;
  message: string;
}

/**
 * Creates a new notification for a user
 *
 * @param params - The notification parameters
 * @returns ActionResult with the created notification or error
 */
export const createNotification = async (
  params: CreateNotificationParams,
): Promise<ActionResult<NotificationType>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const notification = await Notification.create(params);
    return JSON.parse(JSON.stringify(notification)) as NotificationType;
  }, "Error creating notification");
};

/**
 * Creates multiple notifications at once (for batch assignments)
 *
 * @param notifications - Array of notification parameters
 * @returns ActionResult with the created notifications or error
 */
export const createNotifications = async (
  notifications: CreateNotificationParams[],
): Promise<ActionResult<NotificationType[]>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const createdNotifications = await Notification.insertMany(notifications);
    return JSON.parse(
      JSON.stringify(createdNotifications),
    ) as NotificationType[];
  }, "Error creating notifications");
};

/**
 * Fetches notifications for a specific user
 *
 * @param clerkUserId - The Clerk user ID
 * @param limit - Maximum number of notifications to fetch (default: 20)
 * @param unreadOnly - If true, only fetches unread notifications
 * @returns ActionResult with array of notifications or error
 */
export const fetchNotifications = async (
  clerkUserId: string,
  limit: number = 20,
  unreadOnly: boolean = false,
): Promise<ActionResult<NotificationType[]>> => {
  return handleAsyncOperation(async () => {
    const user = await currentUser();
    if (!user || user.id !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const query = unreadOnly
      ? { recipientClerkUserId: clerkUserId, read: false }
      : { recipientClerkUserId: clerkUserId };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(notifications));
  }, "Error fetching notifications");
};

/**
 * Gets the count of unread notifications for a user
 *
 * @param clerkUserId - The Clerk user ID
 * @returns ActionResult with the count or error
 */
export const getUnreadNotificationCount = async (
  clerkUserId: string,
): Promise<ActionResult<number>> => {
  return handleAsyncOperation(async () => {
    const user = await currentUser();
    if (!user || user.id !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const count = await Notification.countDocuments({
      recipientClerkUserId: clerkUserId,
      read: false,
    }).exec();

    return count;
  }, "Error fetching unread notification count");
};

/**
 * Marks a single notification as read
 *
 * @param notificationId - The notification ID
 * @returns ActionResult with success status or error
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<ActionResult<boolean>> => {
  return handleAsyncOperation(async () => {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    await connectDB();

    // Verify the notification belongs to the current user
    const notification = (await Notification.findById(notificationId)
      .lean()
      .exec()) as { recipientClerkUserId?: string } | null;
    if (!notification || notification.recipientClerkUserId !== user.id) {
      throw new Error("Unauthorized");
    }

    await Notification.findByIdAndUpdate(notificationId, {
      read: true,
      readAt: new Date(),
    }).exec();

    return true;
  }, "Error marking notification as read");
};

/**
 * Marks all notifications as read for a user
 *
 * @param clerkUserId - The Clerk user ID
 * @returns ActionResult with success status or error
 */
export const markAllNotificationsAsRead = async (
  clerkUserId: string,
): Promise<ActionResult<boolean>> => {
  return handleAsyncOperation(async () => {
    const user = await currentUser();
    if (!user || user.id !== clerkUserId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    await Notification.updateMany(
      { recipientClerkUserId: clerkUserId, read: false },
      { read: true, readAt: new Date() },
    ).exec();

    return true;
  }, "Error marking all notifications as read");
};

/**
 * Deletes old notifications (older than specified days)
 * Can be called by a cron job or admin action
 *
 * @param daysOld - Delete notifications older than this many days (default: 90)
 * @returns ActionResult with the number of deleted notifications or error
 */
export const deleteOldNotifications = async (
  daysOld: number = 90,
): Promise<ActionResult<number>> => {
  return handleAsyncOperation(async () => {
    await connectDB();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    }).exec();

    return result.deletedCount;
  }, "Error deleting old notifications");
};
