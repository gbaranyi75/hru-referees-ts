import EmbeddedMatches from "@/components/EmbeddedMatches";
import MatchListTable from "@/components/MatchListTable";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

const MatchesPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Mérkőzések" />
      {/* <Matches />
      <EmbeddedMatches /> */}
      <MatchListTable />
    </PageLayout>
  );
};
export default MatchesPage;
