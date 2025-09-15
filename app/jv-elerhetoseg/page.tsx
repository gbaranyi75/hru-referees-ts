import AddMatchDays from "@/components/AddMatchDays";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

const MatchDaysPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Elérhetőség megadása" />
      <AddMatchDays />
    </PageLayout>
  );
};

export default MatchDaysPage;
