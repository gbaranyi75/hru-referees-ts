const DeleteButton = ({
  text,
  type = "button", // Assign a default value to 'type'
  onClick,
}: {
  text: string;
  type?: "submit" | "reset" | "button"; // Update the type to be optional and accept valid button types
  onClick: any;
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

