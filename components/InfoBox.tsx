import Link from "next/link";
import { ReactNode } from "react";

const InfoBox = ({
  heading,
  backgroundColor = "bg-gray-100",
  textColor = "text-gray-600",
  buttonInfo,
  children,
}: {
  heading: any;
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
  buttonInfo: any;
  children: ReactNode;
}) => {
  return (
    <div className={`${backgroundColor} p-12 rounded-lg shadow-md`}>
      <h2 className={`${textColor} text-2xl font-bold`}>{heading}</h2>
      <p className={`${textColor} mt-2 mb-7`}>{children}</p>
      <Link
        href={buttonInfo.link}
        className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
};
export default InfoBox;
