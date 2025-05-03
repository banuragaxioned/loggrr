import { EstimateItemsClient } from "./estimate-items-client";

export type PageProps = { params: Promise<{ organization: string; id: string }> };

export default async function EstimatePage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  return <EstimateItemsClient id={id} />;
}
