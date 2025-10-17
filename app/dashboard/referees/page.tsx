import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import RefereesEdit from "@/components/RefereesEdit";


const MatchesPage = async () => {
  const usersData = await fetchUsers();
  const users: User[] = await convertToJSON(usersData);

  return (
    <PageLayout>
      <PageTitle title="Játékvezetői profilok szerkesztése" />
      <RefereesEdit />
    </PageLayout>
  );
};

export default MatchesPage;
