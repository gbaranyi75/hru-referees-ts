import Link from "next/link";

const LinkButton = ({ text, link }: { text: string; link: string }) => {
  return (
    <>
      <button
        type="button"
        className="justify-center text-blue-500 hover:underline"
      >
        <Link href={link}>{text}</Link>
      </button>
    </>
  );
};

export default LinkButton;
