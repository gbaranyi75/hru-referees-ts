import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";

const HomePage = () => {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-5">
        <Hero />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <InfoBoxes />
      </div>
    </div>
  );
};
export default HomePage;
