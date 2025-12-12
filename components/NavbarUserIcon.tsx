'use client'

import { Icon } from "@iconify/react";
import Image from "next/image";
import profileImage from "@/public/images/profile-image.png";

const NavbarUserIcon = ({
  image,
  username,
}: {
  image?: string;
  username?: string;
}) => {
  const splittedUserName = username?.split(" ") || "";

  return (
    <div className="flex items-center">
      <span>
        <Image
          className="h-8 w-8 rounded-full mr-1"
          src={image || profileImage}
          alt="profilkép"
          width={60}
          height={60}
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
      </span>
      <span className="hidden md:block m-1 font-medium">
        {splittedUserName.length < 2
          ? splittedUserName[0]
          : splittedUserName[1]}
      </span>
      <span>
        <Icon
          icon="lucide:chevron-down"
          width="20"
          height="20"
          className="hidden md:block"
        />
      </span>
    </div>
  );
};

export default NavbarUserIcon;
