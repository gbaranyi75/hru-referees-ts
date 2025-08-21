import InfoBox from "./InfoBox";

const InfoBoxes = () => {
  return (
    <section>
      <div className='container m-auto max-w-7xl text-center md:text-left text-gray-600'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 rounded-lg mx-4">
          <InfoBox
            heading="Játékvezetőink"
            backgroundColor="bg-white"
            buttonInfo={{
              text: "Ugrás a listára",
              link: "/jatekvezetok",
              backgroundColor: "bg-green-800",
            }}
          >
            Jelenleg aktívan dolgozó hazai játékvezetők.
          </InfoBox>
          <InfoBox
            heading="Mérkőzések"
            backgroundColor="bg-white"
            buttonInfo={{
              text: "Ugrás a listára",
              link: "/merkozesek",
              backgroundColor: "bg-green-800",
            }}
          >
            A jelenlegi szezonban lefixált mérkőzések listája.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};
export default InfoBoxes;
