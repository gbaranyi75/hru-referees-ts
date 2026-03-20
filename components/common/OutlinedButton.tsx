const OutlinedButton = ({
  text,
  type = "button", // Assign a default value to 'type'
  onClick,
  disabled = false,
}: {
  text: string;
  type?: "submit" | "reset" | "button"; // Update the type to be optional and accept valid button types
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className="inline-flex justify-center py-2 px-4 cursor-pointer border text-md border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 shadow-sm font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-blue-500 disabled:hover:text-blue-500"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default OutlinedButton;
