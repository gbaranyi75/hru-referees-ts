import { User } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

const RefereesCard = async ({ referee }: { referee: User }) => {

  return (
    <div className="flex flex-col sm:flex-row py-3 bg-white w-full justify-between items-center border-b border-gray-300 hover:border-b-2 hover:bg-zinc-50 relative">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="flex justify-center px-4 py-1 sm:py-0">
          <Image
            src={referee.image}
            alt="User"
            height={0}
            width={0}
            sizes="100vw"
            className="w-10 h-10 rounded-full object-contain aspect-square"
            priority
          />
        </div>
        <div className="flex text-sm font-normal text-gray-600 w-40 py-1 sm:py-1 justify-center sm:justify-start">
          {referee.username}
        </div>
        <div className="flex text-sm font-normal text-gray-600 w-36 py-1 sm:py-1 justify-center sm:justify-start">
          {referee.email}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Link
          href="#"
          type="button"
          data-modal-target="editUserModal"
          data-modal-show="editUserModal"
          className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline px-4 py-1 sm:py-1 w-24"
        >
          Adatlap
        </Link>
      </div>
    </div>
  );
};
export default RefereesCard;
