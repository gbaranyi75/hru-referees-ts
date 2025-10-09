import InfoBox from "./InfoBox";

const InfoBoxes = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <InfoBox
        heading="Játékvezetőink"
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
        buttonInfo={{
          text: "Ugrás a listára",
          link: "/merkozesek",
          backgroundColor: "bg-green-800",
        }}
      >
        A jelenlegi szezonban lefixált mérkőzések listája.
      </InfoBox>
    </div>
  );
};
export default InfoBoxes;
