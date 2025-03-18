import { customAlphabet } from "nanoid";

export const nanoid = (length = 14) => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return customAlphabet(alphabet, length)();
};
