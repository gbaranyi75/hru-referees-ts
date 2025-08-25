import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import Skeleton from "./common/Skeleton";
import RefereesTable from "./RefereesTable";

const Referees = async () => {
  const usersData = await fetchUsers();
  const users: User[] = await convertToJSON(usersData);

  return (
    <section>
      <div className="m-auto mt-5">
        <div className=" border border-gray-200 rounded-xl overflow-hidden">
          {users ? (
            <RefereesTable referees={users} />
          ) : (
            <Skeleton className="" />
          )}
        </div>
      </div>
    </section>
  );
};
export default Referees;
