import ProfileCardWrapper from "@/components/ProfileCardWrapper";
import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";

export const dynamic = 'force-dynamic';

const ProfilePage = () => {
  return (
    <PageLayout>
      <PageTitle title="Profilom" />
      <ProfileCardWrapper />
    </PageLayout>
  );
};
export default ProfilePage;
