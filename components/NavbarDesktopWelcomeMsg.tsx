import { SignedIn } from "@clerk/nextjs";

const NavbarDesktopWelcomeMsg = ({loggedInUser}:{loggedInUser: any}) => {
  
  return (
    <div className="hidden md:block text-gray-600 text-sm">
      <SignedIn>
        <span>Hello, </span>
        <span className="font-semibold">{loggedInUser?.username}</span>
      </SignedIn>
    </div>
  );
};

export default NavbarDesktopWelcomeMsg;
