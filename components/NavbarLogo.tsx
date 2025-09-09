import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/hru-logo_sm.png";

const NavbarLogo = () => {
  return (
    <Link className="flex h-16 flex-shrink-0 items-center" href="/">
      <Image
        className="h-12 w-auto"
        src={logo}
        alt="JV Bizottság"
        width={40}
        height={40}
        sizes="100vw"
        priority
        style={{ objectFit: "scale-down" }}
      />

      <span className="hidden md:block font-bold">
        <div className="text-gray-500 text-xs font-bold md:ml-2">
          <div className="flex-col">
            <div className="flex justify-center">MRGSZ</div>
            <div className="flex justify-center">Játékvezetői Bizottság</div>
          </div>
        </div>
      </span>

      
    </Link>
  );
};

export default NavbarLogo;
