import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import VideoList from "@/components/Media";
export const dynamic = "force-dynamic";

const MediaPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Média" />
      <VideoList />
    </PageLayout>
  );
};
export default MediaPage;
