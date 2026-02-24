const Hero = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-red-600 py-2 md:py-6 max-w-full mx-auto xl:h-96 rounded-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          MRGSZ Játékvezetői Bizottság
        </h2>
        <p className="my-2 text-l text-white">
          Információk, hírek a játékvezetőkről és a mérkőzésekről.
        </p>
      </div>
    </div>
  );
};
export default Hero;
