import SpreadSheet from "@/components/SpreadSheet";
import PageLayout from "@/components/common/PageLayout";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import { User } from "@/types/types";

const SpreadSheetPage = async () => {
  const usersData = await fetchUsers();
  const users = await convertToJSON(usersData);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 md:mb-10">
        Elérhető játékvezetők
      </h1>
      <SpreadSheet users={users} />
    </PageLayout>
  );
};
export default SpreadSheetPage;
