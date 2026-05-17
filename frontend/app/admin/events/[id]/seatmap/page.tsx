import AdminSeatMapBuilder from "@/components/admin/seat-map-builder/AdminSeatMapBuilder";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <AdminSeatMapBuilder id={id} />;
}