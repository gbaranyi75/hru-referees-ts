import Profile from "@/components/Profile";
import PageLayout from "@/components/common/PageLayout";

const ProfilePage = () => {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-2">Profilom</h1>
      <Profile />
    </PageLayout>
  );
};
export default ProfilePage;
