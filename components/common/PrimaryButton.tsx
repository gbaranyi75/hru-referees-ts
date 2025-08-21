const PrimaryButton = ({
  text,
  type = "button", // Assign a default value to 'type'
  onClick,
}: {
  text: string;
  type?: "submit" | "reset" | "button"; // Update the type to be optional and accept valid button types
  onClick?: any;
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-blue-700 hover:bg-blue-500"
      >
        {text}
      </button>
    </>
  );
};

export default PrimaryButton;
