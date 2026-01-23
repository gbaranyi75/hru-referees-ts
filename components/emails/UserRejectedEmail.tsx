import { Html, Tailwind, Head, Body, Container, Text, Font } from "@react-email/components";

interface Props {
  username: string;
}

const UserRejectedEmail: React.FC<Props> = ({ username }) => (
  <Html>
    <Tailwind>
      <Head>
        <title>Regisztráció jóváhagyva</title>
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
      <Body className="bg-[#e5e5e3] py-10 text-gray-600 ">
        <Container className="mx-auto max-w-150 text-center">
          <Text className="text-2xl font-bold my-8 uppercase tracking-tight">
            Elutasított regisztrációs kérelem
          </Text>
          <Text className="text-md mb-2">
            Kedves <b>{username}</b>!
          </Text>
          <Text className="text-md mb-8">
            Sajnálattal közöljük, hogy a regisztrációdat az admin nem hagyta jóvá, mostantól nincs hozzáférésed a rendszerhez.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default UserRejectedEmail;
