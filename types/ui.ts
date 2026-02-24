import React from "react";

export type NavItem = {
  path?: string;
  label: string;
  type: string;
  icon?: React.JSX.Element;
  submenu?: boolean;
  subItems?: { label: string; path?: string; href?: string }[];
};
