import { useRouter } from "next/router"

export const metadataGenerator = ()=> {

    const {route} = useRouter();

    console.log(route)

}