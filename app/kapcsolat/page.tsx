import PageLayout from "@/components/common/PageLayout";
import PageTitle from "@/components/common/PageTitle";
import {ContactForm} from "@/components/contact";
export const dynamic = "force-dynamic";

const ContactPage = () => {
  return (
    <PageLayout>
      <PageTitle title="Elérhetőségeink" />
      <ContactForm />
    </PageLayout>
  );
};

export default ContactPage;
