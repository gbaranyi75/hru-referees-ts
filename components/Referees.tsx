import RefereesCard from "./RefereesCard";
import RefereesCardListHeader from "./RefereesCardListHeader";
import { User } from "@/types/types";
import { fetchUsers } from "@/lib/actions/fetchUsers";
import { convertToJSON } from "@/lib/utils/convertToJSON";
import Skeleton from "./common/Skeleton";

const Referees = async () => {
  const usersData = await fetchUsers();
  const users: User[] = await convertToJSON(usersData);

  return (
    <section>
      <div className="m-auto px-12 md:px-4 py-2">
        <div className="flex flex-col rounded-xl shadow-md overflow-hidden">
          {users ? (
            <>
              <div className="hidden sm:block">
                <RefereesCardListHeader />
              </div>
              {users.map((user) => (
                <RefereesCard key={user._id} referee={user} />
              ))}
            </>
          ) : (
            <>
              <div className="hidden sm:block">
                <RefereesCardListHeader />
              </div>
              <div className="flex flex-col border-b border-gray-300 bg-white text-gray-600 text-center drop-shadow-md hover:drop-shadow-xl justify-center z-0">
                <Skeleton className=""
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
export default Referees;
