import SeatSelection from "@/components/SeatSelection/SeatSelection";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SeatSelection id={id} />;
}
