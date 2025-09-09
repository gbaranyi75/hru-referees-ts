import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import CalendarNew from "@/components/CalendarNew";
import CalendarEdit from "@/components/CalendarEdit";

const CalendarPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Táblázatok létrehozása, szerkesztése" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
        <div className="space-y-6">
          <CalendarNew />
          <CalendarEdit />
        </div>
      </div>
    </PageLayout>
  );
};

export default CalendarPage;
