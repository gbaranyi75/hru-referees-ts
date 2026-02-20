import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import TeamsEdit from "@/components/TeamsEdit";
export const dynamic = "force-dynamic";

const TeamsPage = async () => {
  return (
    <PageLayout>
      <PageTitle title="Csapatok szerkesztése" />
      <TeamsEdit />
    </PageLayout>
  );
};

export default TeamsPage;
