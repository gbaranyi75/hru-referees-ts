import ProfileInfoCard from "@/components/ProfileInfoCard";
import ProfileMetaCard from "@/components/ProfileMetaCard";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

const ProfilePage = () => {
  return (
    <PageLayout>
      <PageTitle title="Profilom" />
      <div className="rounded-xl border border-gray-200 bg-white p-5 mt-5">
        <div className="space-y-6">
          <ProfileMetaCard />
          <ProfileInfoCard />
        </div>
      </div>
    </PageLayout>
  );
};
export default ProfilePage;
