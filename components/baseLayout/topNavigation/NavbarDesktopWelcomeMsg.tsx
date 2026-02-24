import { SignedIn } from "@clerk/nextjs";
import { User } from "@/types/models";

const NavbarDesktopWelcomeMsg = ({loggedInUser}:{loggedInUser: User | null}) => {
  
  return (
    <div className="hidden lg:block text-gray-600 text-sm">
      <SignedIn>
        <span>Hello, </span>
        <span className="font-semibold">{loggedInUser?.username}</span>
      </SignedIn>
    </div>
  );
};

export default NavbarDesktopWelcomeMsg;
