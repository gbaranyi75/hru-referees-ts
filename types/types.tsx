import { JSX } from "react";

export type NavLink = {
  path: string;
  label: string;
  type: string;
  icon?: JSX.Element;
};

export type ProfileLink = {
  path: string;
  label: string;
  type: string;
  icon?: JSX.Element;
};

export type UserSelection = {
  _id: string;
  calendarId: string;
  selectedDays: string[];
  username: string;
  clerkUserId: string;
}

export type Calendar = {
  _id: string;
  name: string;
  days: string[];
}

export type User = {
  _id: string;
  username: string;
  email: string;
  clerkUserId: string;
  image: string;
}