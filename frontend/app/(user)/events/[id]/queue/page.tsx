import WaitingRoom from "@/components/WaitingRoom/WaitingRoom";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <WaitingRoom id={id} />;
}