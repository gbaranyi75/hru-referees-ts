import { Tailwind, Body, Container, Head, Html, Text, Font } from "@react-email/components";

interface Props {
  name: string;
  email: string;
  message: string;
}

export const ContactMessageEmail: React.FC<Readonly<Props>> = ({ name, email, message }) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Kapcsolatfelvételi üzenet</title>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body className="bg-[#e5e5e3] py-10 text-gray-600">
          <Container className="mx-auto max-w-150 text-left">
            <Text className="text-2xl font-bold mb-6">Új kapcsolatfelvételi üzenet</Text>
            <Text className="mb-2">Név: <span className="font-semibold">{name}</span></Text>
            <Text className="mb-2">Email: <span className="font-semibold">{email}</span></Text>
            <Text className="mb-4">Üzenet:</Text>
            <Text className="bg-white p-4 rounded border border-gray-200">{message}</Text>
            <Text className="text-xs mt-7 mb-2 text-gray-600">Üdvözlettel,<br />hru-referees.hu weboldal</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactMessageEmail;
