import MatchesEdit from "@/components/MatchesEdit";
import CardLayout from "@/components/CardLayout";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { User } from "@/types/types";

const EditMatchesPage = async () => {
  const usersData = await fetchUsers();
  const users = convertToJSON(usersData);
  return (
    <CardLayout>
      {/* <MatchesEdit users={users} /> */}
      <div></div>
    </CardLayout>
  );
};
export default EditMatchesPage;
