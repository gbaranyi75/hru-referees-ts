import Link from "next/link";
import CardLayout from "@/components/CardLayout";
import OutlinedButton from "@/components/common/OutlinedButton";

const MatchesPage = () => {
  return (
    <div className="w-full flex flex-col md:flex-row bg-blue-50">
      <div className="w-full">
        <CardLayout>
          <Link href="/dashboard/matches/new" className="my-6">
            <OutlinedButton text={"Új mérkőzés létrehozása"} />
          </Link>
        </CardLayout>
        <CardLayout>
          <Link href="/dashboard/matches/edit" className="my-6">
            <OutlinedButton text={"Mérkőzések szerkesztése"} />
          </Link>
        </CardLayout>
        <div></div>
      </div>
    </div>
  );
};

export default MatchesPage;
