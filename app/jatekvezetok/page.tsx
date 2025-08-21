import Referees from "@/components/Referees";
import PageLayout from "@/components/common/PageLayout";

const RefereesPage = () => {

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2 md:mb-10">Játékvezetők</h1>
      <Referees />
    </PageLayout>
  );
};
export default RefereesPage;
