import { Icon } from "@iconify/react";
import Image from "next/image";
import profileImage from "@/assets/images/profile-image.png";

const NavbarUserIcon = ({ image }: { image: string }) => {
  return (
    <div className="flex items-center">
      <Image
        className="h-8 w-8 rounded-full"
        src={image || profileImage}
        alt="profilkép"
        width={60}
        height={60}
        sizes="100vw"
        priority
        style={{ objectFit: "cover" }}
      />
      <Icon
        icon="lucide:chevron-down"
        width="20"
        height="20"
        className="hidden md:block ml-1"
      />
    </div>
  );
};

export default NavbarUserIcon;
