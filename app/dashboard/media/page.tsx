import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import MediaEdit from "@/components/MediaEdit";
export const dynamic = "force-dynamic";

const MediaPage = async () => {
  return (
    <PageLayout>
      <PageTitle title="Média szerkesztése" />
      <MediaEdit />
    </PageLayout>
  );
};

export default MediaPage;
