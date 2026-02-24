import { Referees } from "@/components/referees";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
export const dynamic = "force-dynamic";

const RefereesPage = () => {

  return (
    <PageLayout>
      <PageTitle title="Játékvezetők" />
      <Referees />
    </PageLayout>
  );
};
export default RefereesPage;
