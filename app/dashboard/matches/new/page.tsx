import MatchesNew from "@/components/MatchesNew";
import CardLayout from "@/components/CardLayout";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";

const CreateMatchPage = async () => {
  const usersData = await fetchUsers();
  const users = convertToJSON(usersData);
  return (
    <CardLayout>
      <MatchesNew users={users} />
    </CardLayout>
  );
};
export default CreateMatchPage;
