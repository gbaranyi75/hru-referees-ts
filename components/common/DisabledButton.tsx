const DisabledButton = ({ text }: { text: string }) => {
  return (
    <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-gray-300 hover:bg-gray-400" disabled>
      {text}
    </button>
  );
};

export default DisabledButton;
