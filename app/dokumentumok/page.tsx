import Documents from "@/components/Documents";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { getSessionUser } from "@/lib/utils/getSessionUser";

const DocumentsPage = async () => {
  const { user } = await getSessionUser();
  const role: string = user ? user?.publicMetadata?.role : ("guest" as const);

  return (
    <PageLayout>
      <PageTitle title="Letölthető dokumentumok" />
      <Documents role={role} />
    </PageLayout>
  );
};
export default DocumentsPage;
