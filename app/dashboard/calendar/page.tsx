import Link from "next/link";
import CardLayout from "@/components/CardLayout";
import OutlinedButton from "@/components/common/OutlinedButton";

const CalendarPage = () => {
  return (
    <div className="w-full flex flex-col md:flex-row bg-gray-50">
      <div className="w-full">
        <CardLayout>
          <Link href="/dashboard/calendar/new" className="my-6">
            <OutlinedButton text={"Új táblázat létrehozása"} />
          </Link>
        </CardLayout>
        <CardLayout>
          <Link href="/dashboard/calendar/edit" className="my-6">
            <OutlinedButton text={"Táblázatok szerkesztése"} />
          </Link>
        </CardLayout>
        <div></div>
      </div>
    </div>
  );
};

export default CalendarPage;
