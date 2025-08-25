import { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return <div className="text-gray-600 bg-gray-100">{children}</div>;
};
export default PageLayout;
