"use client";

import { Icon } from "@iconify/react";
import { NavItem } from "@/types/types";

export const NAV_LINKS: NavItem[] = [
  {
    path: "/",
    label: "Főoldal",
    type: "public",
    icon: (
      <Icon
        icon="lucide:home"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/tablazat",
    label: "Táblázat",
    type: "public",
    icon: (
      <Icon
        icon="lucide:table"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/jatekvezetok",
    label: "Játékvezetők",
    type: "public",
    icon: (
      <Icon
        icon="lucide:users-round"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/merkozesek",
    label: "Mérkőzések",
    type: "public",
    icon: (
      <Icon
        icon="lucide:tv"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/media",
    label: "Média",
    type: "public",
    icon: (
      <Icon
        icon="lucide:file-video"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/kapcsolat",
    label: "Kapcsolat",
    type: "public",
    icon: (
      <Icon
        icon="lucide:link"
        width="20"
        height="20"
      />
    ),
  },
];

export const PROFILE_LINKS: NavItem[] = [
  {
    path: "/profil",
    label: "Profilom",
    type: "user",
    icon: (
      <Icon
        icon="lucide:user-round"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/jv-elerhetoseg",
    label: "Elérhetőség megadása",
    type: "user",
    icon: (
      <Icon
        icon="lucide:calendar-days"
        width="20"
        height="20"
      />
    ),
  },
  {
    path: "/dokumentumok",
    label: "Dokumentumok",
    type: "user",
    icon: (
      <Icon
        icon="lucide:dock"
        width="20"
        height="20"
      />
    ),
  },
];

export const ADMIN_LINKS: NavItem[] = [
  {
    label: "Admin Dashboard",
    type: "admin",
    path: "/dashboard",
    icon: (
      <Icon
        icon="lucide:layout-dashboard"
        width="20"
        height="20"
      />
    ),
    subItems: [
      { label: "Táblázatok", path: "/dashboard/calendar" },
      { label: "Mérkőzések", path: "/dashboard/matches" },
      { label: "Játékvezetők", path: "/dashboard/referees" },
      { label: "Csapatok", path: "/dashboard/teams" },
      { label: "Videók", path: "/dashboard/media" },
    ],
  },
];

export const SOCIAL_LINKS: NavItem[] = [
  {
    label: "Facebook és web linkek",
    type: "social",
    icon: (
      <Icon
        icon="lucide:facebook"
        width="20"
        height="20"
      />
    ),
    subItems: [
      {
        label: "MRGSZ-JB zárt FB csoport",
        href: "https://www.facebook.com/groups/513219272190437",
      },
      { label: "MRGSZ Facebook oldal", href: "https://www.facebook.com/MRGSZ" },
      { label: "MRGSZ hivatalos weboldal", href: "https://www.rugby.hu" },
    ],
  },
];
