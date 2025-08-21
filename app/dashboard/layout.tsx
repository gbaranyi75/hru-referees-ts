import SideMenu from "@/components/SideMenu";
import PageLayout from "@/components/common/PageLayout";
import { ReactNode } from "react";

const DashboardPage = ({ children }: {children: ReactNode}) => {
  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row mt-2 md:mt-5">
        <div className="basis-1/4">
          <SideMenu />
        </div>
        <div className="flex basis-3/4">{children}</div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
