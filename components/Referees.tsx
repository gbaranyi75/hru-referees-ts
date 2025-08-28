import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import RefereesTable from "./RefereesTable";

const Referees = async () => {
  const usersData = await fetchUsers();
  const users: User[] = await convertToJSON(usersData);

  return (
    <section>
      <div className="m-auto mt-5">
        <div className="rounded-xl overflow-hidden">
          <RefereesTable refereesData={users} />
        </div>
      </div>
    </section>
  );
};
export default Referees;
