import { Html, Tailwind, Head, Body, Container, Text, Link, Font } from "@react-email/components";

interface Props {
  username: string;
  email: string;
}

const AdminNewUserEmail: React.FC<Props> = ({ username, email }) => (
  <Html>
    <Tailwind>
      <Head>
        <title>Új regisztráció</title>
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
            Új felhasználó regisztrált
          </Text>
          <Text className="text-md mb-2">
            Felhasználónév: <b>{username}</b>
          </Text>
          <Text className="text-md mb-2">
            Email cím: <b>{email}</b>
          </Text>
          <Text className="text-md mb-8">
            Kérjük, ellenőrizd és hagyd jóvá vagy utasítsd el a regisztrációt az admin felületen.
          </Text>
          <Link className="text-xs text-blue-400 underline" href="https://hru-referees.hu">
            MRGSZ Játékvezetői Bizottság
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AdminNewUserEmail;
