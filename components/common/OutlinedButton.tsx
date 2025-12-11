const OutlinedButton = ({
  text,
  type = "button", // Assign a default value to 'type'
  onClick,
}: {
  text: string;
  type?: "submit" | "reset" | "button"; // Update the type to be optional and accept valid button types
  onClick?: () => void;
}) => {
  return (
    <>
      <button
        type={type}
        className="inline-flex justify-center py-2 px-4 cursor-pointer border text-md border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 shadow-sm font-medium rounded-md"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default OutlinedButton;
