import { Icon } from "@iconify/react";
import { NavLink, ProfileLink } from "@/types/types";

export const NAV_LINKS: NavLink[] = [
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
  // { path: "/", label: "Később...", type: "private" },
];

export const PROFILE_LINKS: ProfileLink[] = [
  {
    path: "/profil",
    label: "Profilom",
    type: "user",
    icon: <Icon icon="lucide:user-round" width="20" height="20" />,
  },
  /* {
    path: "/dashboard/calendar",
    label: "Admin Dashboard",
    type: "admin",
    icon: <Icon icon="lucide:layout-dashboard" width="20" height="20" />,
  }, */
  {
    path: "/jv-elerhetoseg",
    label: "Elérhetőség megadása",
    type: "user",
    icon: <Icon icon="lucide:calendar-days" width="20" height="20" />,
  },
];
