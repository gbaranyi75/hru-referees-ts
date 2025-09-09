import MatchesNew from "@/components/MatchesNew";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import MatchesEdit from "@/components/MatchesEdit";

const MatchesPage = async () => {
  const usersData = await fetchUsers();
  const users: User[] = await convertToJSON(usersData);

  return (
    <PageLayout>
      <PageTitle title="Mérkőzések létrehozása, szerkesztése" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
        <div className="space-y-6">
          <MatchesNew referees={users} />
          <MatchesEdit referees={users} />
        </div>
      </div>
    </PageLayout>
  );
};

export default MatchesPage;
