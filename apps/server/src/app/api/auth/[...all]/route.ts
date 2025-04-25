import { auth } from "@/lib/auth";

export default {
  async fetch(request: Request) {
    const authInstance = auth;
    return authInstance.handler(request);
  },
};
