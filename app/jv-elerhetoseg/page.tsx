import AddMatchDays from "@/components/AddMatchDays";
import PageLayout from "@/components/common/PageLayout";
import { fetchCalendars } from "@/lib/actions/fetchCalendars";
import { fetchProfile } from "@/lib/actions/fetchProfile";
import { convertToJSON } from "@/lib/utils/convertToJSON";

const MatchDaysPage = async () => {
  const calendarsData = await fetchCalendars();
  const profileData = await fetchProfile();
  const calendars = convertToJSON(calendarsData);
  const profile = convertToJSON(profileData);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2">Elérhetőség megadása</h1>
      <AddMatchDays calendars={calendars} profile={profile} />
    </PageLayout>
  );
};

export default MatchDaysPage;
