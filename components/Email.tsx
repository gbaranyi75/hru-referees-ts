import { Match } from "@/types/types";
import {
  Tailwind,
  Body,
  Container,
  Head,
  Html,
  Link,
  Section,
  Text,
  Font,
} from "@react-email/components";

interface Params {
  username: string;
  messageData: Match;
}
export const Email: React.FC<Readonly<Params>> = ({
  username,
  messageData,
}): React.ReactNode => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Új küldés</title>
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
          <Container className="mx-auto max-w-[600px] text-center">
            {/* Email content here */}
            <Text className="text-2xl leading-tight font-bold text-gray-600 my-8 uppercase tracking-tight">
              Szia {username.toUpperCase()}!
            </Text>

            {/* More content... */}

            <Section className="my-10 text-left">
              {messageData?.referee?.username === username && (
                <Text className="text-md">
                  Új küldést kaptál Játékvezető poszton a következö mérkőzésre:
                </Text>
              )}
              {messageData?.assist1?.username === username && (
                <Text className="text-md">
                  Új küldést kaptál Asszisztens poszton a következö mérkőzésre:
                </Text>
              )}
              {messageData?.assist2?.username === username && (
                <Text className="text-md">
                  Új küldést kaptál Asszisztens poszton a következö mérkőzésre:
                </Text>
              )}
              {messageData?.controllers[0]?.username && (
                <Text className="text-md">
                  Új küldést kaptál Ellenőr poszton a következö mérkőzésre:
                </Text>
              )}
              {messageData?.referees[0]?.username && (
                <Text className="text-md">
                  Új küldést kaptál Játékvezető poszton a következö mérkőzésre:
                </Text>
              )}
              <Text className="text-md">
                Mérkőzés típusa: {messageData?.gender} {messageData?.age}{" "}
                {messageData?.type}
              </Text>
              {messageData?.type !== "7s" &&
                messageData?.type !== "UP torna" && (
                  <Text className="text-md">
                    Csapatok: {messageData?.home} - {messageData?.away}
                  </Text>
                )}
              <Text className="text-md">Helyszín: {messageData?.venue}</Text>
              <Text className="text-md">Dátum: {messageData?.date}</Text>
              <Text className="text-md">Időpont: {messageData?.time}</Text>
              <Text className="text-xs mt-7 mb-2 text-gray-600">Üdv,</Text>
              <Link
                className="text-xs text-blue-400 underline"
                href="https://hru-referees.hu"
              >
                MRGSZ Játékvezetői Bizottság
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Email;
