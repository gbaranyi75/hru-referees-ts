'use client';

import { Icon } from "@iconify/react";
import { NavItem } from "@/types/types";

export const NAV_LINKS: NavItem[] = [
  {
    path: "/",
    label: "Főoldal",
    type: "public",
    icon: <Icon icon="lucide:home" width="20" height="20" />,
  },
  {
    path: "/tablazat",
    label: "Táblázat",
    type: "public",
    icon: <Icon icon="lucide:table" width="20" height="20" />,
  },
  {
    path: "/jatekvezetok",
    label: "Játékvezetők",
    type: "public",
    icon: <Icon icon="lucide:users-round" width="20" height="20" />,
  },
  {
    path: "/merkozesek",
    label: "Mérkőzések",
    type: "public",
    icon: <Icon icon="lucide:tv" width="20" height="20" />,
  },
  {
    path: "/media",
    label: "Média",
    type: "public",
    icon: <Icon icon="lucide:file-video" width="20" height="20" />,
  },
];

export const PROFILE_LINKS: NavItem[] = [
  {
    path: "/profil",
    label: "Profilom",
    type: "user",
    icon: <Icon icon="lucide:user-round" width="20" height="20" />,
  },
  {
    path: "/jv-elerhetoseg",
    label: "Elérhetőség megadása",
    type: "user",
    icon: <Icon icon="lucide:calendar-days" width="20" height="20" />,
  },
 {
    path: "/dokumentumok",
    label: "Dokumentumok",
    type: "user",
    icon: <Icon icon="lucide:dock" width="20" height="20" />, 
  },
];

export const ADMIN_LINKS: NavItem[] = [
  {
    label: "Admin Dashboard",
    type: "admin",
    path: "/dashboard",
    icon: <Icon icon="lucide:layout-dashboard" width="20" height="20" />,
    subItems: [
      { label: "Táblázat", path: "/dashboard/calendar" },
      { label: "Mérkőzések", path: "/dashboard/matches" },
      { label: "Játékvezetők", path: "/dashboard/referees" },
      { label: "Videók", path: "/dashboard/media" },
    ],
  },
];
