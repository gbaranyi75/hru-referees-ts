import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import RefereesEdit from "@/components/referees/RefereesEdit";
export const dynamic = "force-dynamic";

const RefereesPage = async () => {

  return (
    <PageLayout>
      <PageTitle title="Játékvezetői profilok szerkesztése" />
      <RefereesEdit />
    </PageLayout>
  );
};

export default RefereesPage;
