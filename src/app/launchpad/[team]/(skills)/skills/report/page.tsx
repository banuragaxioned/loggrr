import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Report`
  }
}

export default async function Page({params}:pageProps) {
  generateMetadata({params})
  return (
    <>
      <h3>Coming soon</h3>
    </>
  );
}
