import { Html, Tailwind, Head, Body, Container, Text, Link, Font } from "@react-email/components";

interface Props {
  username: string;
}

const UserApprovedEmail: React.FC<Props> = ({ username }) => (
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
            Sikeres regisztráció
          </Text>
          <Text className="text-md mb-2">
            Kedves <b>{username}</b>!
          </Text>
          <Text className="text-md mb-8">
            A regisztrációdat az admin jóváhagyta, mostantól teljes hozzáférésed van a rendszerhez.
          </Text>
          <Text className="text-md mb-8">
            Kérjük, jelentkezz be újra a teljes funkcionalitásért!
          </Text>
          <Link className="text-xs text-blue-400 underline" href="https://hru-referees.hu">
            MRGSZ Játékvezetői Bizottság
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default UserApprovedEmail;
