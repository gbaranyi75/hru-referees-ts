import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import RefereesEdit from "@/components/RefereesEdit";
export const dynamic = "force-dynamic";


const MatchesPage = async () => {


  return (
    <PageLayout>
      <PageTitle title="Játékvezetői profilok szerkesztése" />
      <RefereesEdit />
    </PageLayout>
  );
};

export default MatchesPage;
