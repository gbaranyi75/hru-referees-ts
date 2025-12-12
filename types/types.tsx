import { JSX } from "react";

export type NavItem = {
  path?: string;
  label: string;
  type: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subItems?: { label: string; path: string }[];
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

  export type ClerkUser = {
    id: string;
    emailAddresses: { emailAddress: string }[];
    username: string;
  };