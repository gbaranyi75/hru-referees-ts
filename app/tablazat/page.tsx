import SpreadSheet from "@/components/SpreadSheet";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

const SpreadSheetPage = () => {

  return (
    <PageLayout>
      <PageTitle title="Elérhető játékvezetők" />
      <SpreadSheet />
    </PageLayout>
  );
};
export default SpreadSheetPage;
