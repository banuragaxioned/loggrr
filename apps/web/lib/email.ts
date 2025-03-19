import { authClient } from "@workspace/auth/client";

export const sendMagicLink = async (email: string) => {
  const { data, error } = await authClient.signIn.magicLink({
    email,
    callbackURL: "/dashboard",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
