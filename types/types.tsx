import { JSX } from "react";

export type NavItem = {
  path?: string;
  label: string;
  type: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subItems?: { label: string; path?: string; href?: string }[];
};

export type UserSelection = {
  _id: string;
  calendarId: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
};

export type Calendar = {
  _id?: string;
  name: string;
  days: string[];
};

export type User = {
  _id: string;
  username: string;
  email: string;
  clerkUserId: string;
  image: string;
  address?: Address;
  status: string;
  hasTitle: string;
  facebookUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
};

export type Address = {
  city?: string;
  country: string;
};

export type MatchOfficial = {
  username: string;
  clerkUserId?: string;
  email?: string;
};

export type Match = {
  _id?: string;
  home: string;
  away: string;
  type: string;
  gender: string;
  age: string;
  venue: string;
  referee: MatchOfficial;
  referees: MatchOfficial[];
  assist1: MatchOfficial;
  assist2: MatchOfficial;
  controllers: MatchOfficial[];
  date: string;
  time: string;
};

export type SendEmail = {
  email: string;
  username: string;
  clerkUserId: string;
  messageData?: Match;
};

export type Media = {
  _id?: string;
  name: string;
  mediaUrl: string;
  createdAt: string;
};

export type GuestUser = {
  _id?: string;
  username: string;
  address: Address;
  status: string;
  isGuest: boolean;
};

export type ButtonInfo = {
  text: string;
  link: string;
  backgroundColor: string;
};

export type CloudinaryUploadResult = {
  info: {
    secure_url: string;
    public_id: string;
  };
};

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Server Action response type
 * Unified type for all server actions to ensure consistency
 * @template T - The type of data returned on success
 */
export type ActionResult<T> = Result<T>;

export type ClerkUser = {
  id: string;
  emailAddresses: { emailAddress: string }[];
  username: string;
  publicMetadata: Record<string, string | boolean | number>;
};

export type NotificationType = "match_assignment" | "match_removal" | "new_registration";

export type NotificationPosition =
  | "referee"
  | "assist1"
  | "assist2"
  | "controller"
  | "referees";

export type Notification = {
  _id: string;
  recipientClerkUserId: string;
  type: NotificationType;
  position?: NotificationPosition;
  matchId?: string;
  message: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Team = {
  _id?: string;
  name: string;
  city?: string;
  teamLeader?: string;
  phone?: string;
  email?: string;
};
