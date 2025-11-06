import MatchesNew from "@/components/MatchesNew";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import MatchesEdit from "@/components/MatchesEdit";

const MatchesPage = () => {

  return (
    <PageLayout>
      <PageTitle title="Mérkőzések létrehozása, szerkesztése" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
        <div className="space-y-6">
          <MatchesNew />
          <MatchesEdit />
        </div>
      </div>
    </PageLayout>
  );
};

export default MatchesPage;
