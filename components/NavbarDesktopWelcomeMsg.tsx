import { SignedIn } from "@clerk/nextjs";

const NavbarDesktopWelcomeMsg = ({loggedInUser}:{loggedInUser: any}) => {
  
  return (
    <div className="hidden md:block text-gray-600 text-sm">
      <SignedIn>
        <div>Hello, {loggedInUser?.username}</div>
      </SignedIn>
    </div>
  );
};

export default NavbarDesktopWelcomeMsg;
