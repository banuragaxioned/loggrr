import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Explore`
  }
}

const Page = async ({params}:pageProps) => {
  generateMetadata({params})
  return <h3>Manage</h3>;
};

export default Page;
