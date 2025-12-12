const DeleteButton = ({
  text,
  type = "button",
  onClick,
}: {
  text: string;
  type?: "submit" | "reset" | "button";
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="inline-flex justify-center py-2 px-4 border border-transparent text-white bg-red-700 hover:bg-red-500 shadow-sm text-md font-medium rounded-md"
      >
        {text}
      </button>
    </>
  );
};

export default DeleteButton;
