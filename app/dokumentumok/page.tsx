import Documents from "@/components/Documents";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { checkRole } from "@/lib/utils/roles";


const DocumentsPage = async () => {
  const isAdmin = await checkRole("admin");

  return (
    <PageLayout>
      <PageTitle title="Letölthető dokumentumok" />
      <Documents isAdmin={isAdmin} />
    </PageLayout>
  );
};
export default DocumentsPage;
