export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Movie ID: {id}</h1>
      <p>This will show details for movie {id}</p>
    </div>
  );
}
