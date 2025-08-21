import MatchItemEdit from "@/components/MatchItemEdit";
import CardLayout from "@/components/CardLayout";
import Match from "@/models/Match";
import connectDB from "@/config/database";
import { convertToSerializeableObject } from "@/lib/utils/convertToObject";
import { User } from "@/types/types";

const MatchEditPage = async ({ params }: { params: { id: string } }) => {
  await connectDB();

  const matchDoc = await Match.findById(params.id).lean();
  const match: Match = convertToSerializeableObject(matchDoc);

  if (!match) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">Match Not Found</h1>
    );
  }

  console.log(match)
  return (
    <CardLayout>
      {/* <MatchItemEdit match={match} /> */}
      <div>később</div>
    </CardLayout>
  );
};
export default MatchEditPage;
