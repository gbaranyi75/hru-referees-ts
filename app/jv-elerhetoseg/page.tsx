import AddMatchDays from "@/components/AddMatchDays";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
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
      <PageTitle title="Elérhetőség megadása" />
      <AddMatchDays calendars={calendars} profile={profile} />
    </PageLayout>
  );
};

export default MatchDaysPage;
