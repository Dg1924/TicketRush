import AdminEventForm from "@/components/admin/event-form/AdminEventForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <AdminEventForm id={id} />;
}