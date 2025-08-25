import EmbeddedMatches from "@/components/EmbeddedMatches";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

const MatchesPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Mérkőzések" />
      {/* <Matches /> */}
      <EmbeddedMatches />
    </PageLayout>
  );
};
export default MatchesPage;
