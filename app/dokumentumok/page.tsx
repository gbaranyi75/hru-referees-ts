import { Documents } from "@/components/documents";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { checkRole } from "@/lib/utils/roles";
export const dynamic = "force-dynamic";


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
