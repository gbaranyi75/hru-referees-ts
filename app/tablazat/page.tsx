import SpreadSheet from "@/components/SpreadSheet";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";

const SpreadSheetPage = async () => {
  const usersData = await fetchUsers();
  const users = await convertToJSON(usersData);

  return (
    <PageLayout>
      <PageTitle title="Elérhető játékvezetők" />
      <SpreadSheet users={users} />
    </PageLayout>
  );
};
export default SpreadSheetPage;
