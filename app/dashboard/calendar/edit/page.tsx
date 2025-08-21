import CardLayout from "@/components/CardLayout";
import CalendarEdit from "@/components/CalendarEdit";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { convertToJSON } from "@/lib/utils/convertToJSON";

const EditCalendarPage = async () => {
  const calendarsData = await fetchCalendars()
  const calendars = convertToJSON(calendarsData)
  return (
    <div className="w-full flex flex-col md:flex-row bg-blue-50">
      <CardLayout>
        <CalendarEdit calendars={calendars}/>
      </CardLayout>
    </div>
  );
};

export default EditCalendarPage;
