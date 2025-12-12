import SpreadSheet from "@/components/SpreadSheet";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

export const dynamic = 'force-dynamic';

const SpreadSheetPage = () => {

  return (
    <PageLayout>
      <PageTitle title="Elérhető játékvezetők" />
      <SpreadSheet />
    </PageLayout>
  );
};
export default SpreadSheetPage;
