import { Route } from "next";
import Link from "next/link";
import { ReactNode } from "react";

const InfoBox = ({
  heading,
  textColor = "text-gray-600",
  buttonInfo,
  children,
}: {
  heading: string;
  textColor?: string | undefined;
  buttonInfo: any;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col xl:h-96 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 justify-between">
      <div>
        <h2 className={`${textColor} text-2xl font-bold`}>{heading}</h2>
        <p className={`${textColor} mt-2 mb-7`}>{children}</p>
      </div>
      <Link
        href={buttonInfo.link as Route}
        className={`inline-block ${buttonInfo.backgroundColor} text-white text-center rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {buttonInfo.text}
      </Link>
    </div>
  );
};
export default InfoBox;
