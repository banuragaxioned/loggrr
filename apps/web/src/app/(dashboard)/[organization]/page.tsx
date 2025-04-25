export type pageProps = { params: Promise<{ organization: string }> };

export default async function Dashboard(props: pageProps) {
  const params = await props.params;
  const { organization } = params;

  return (
    <>
      <h1>Organization: {organization}</h1>
    </>
  );
}
