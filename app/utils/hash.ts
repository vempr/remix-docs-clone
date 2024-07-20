import { genSalt, hash } from "bcrypt-ts";

const saltRounds = Number(process.env.VITE_BCRYPT_SALT_ROUNDS as string);

export default async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}
