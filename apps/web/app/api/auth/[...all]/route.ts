import { auth } from "@workspace/auth";

const handler = auth.handler;

export { handler as GET, handler as POST };
