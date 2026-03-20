const DeleteButton = ({
  text,
  type = "button",
  onClick,
  disabled = false,
}: {
  text: string;
  type?: "submit" | "reset" | "button";
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="inline-flex justify-center py-2 px-4 border border-transparent text-white bg-red-700 hover:bg-red-500 shadow-sm text-md font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-700"
      >
        {text}
      </button>
    </>
  );
};

export default DeleteButton;
