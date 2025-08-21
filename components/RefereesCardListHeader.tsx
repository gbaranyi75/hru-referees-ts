const RefereesCardListHeader = () => {
  return (
    <div className="flex flex-row py-2 bg-green-800 w-full justify-between items-center border-b-2 relative">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="flex w-[72px] justify-center py-1 sm:py-0">{""}</div>
        <div className="flex text-sm font-semibold text-white w-40 py-1 sm:py-1 justify-center sm:justify-start">
          Név
        </div>
        <div className="flex text-sm font-semibold text-white w-36 py-1 sm:py-1 justify-center sm:justify-start">
          Email
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-sm font-semibold text-green-800 px-4 py-1 sm:py-1 w-24">
          Adatlap
        </div>
      </div>
    </div>
  );
};
export default RefereesCardListHeader;
