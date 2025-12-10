import bcrypt from "bcrypt";

const salting = 12;

export async function hash(value: string): Promise<string> {
  return bcrypt.hash(value, salting);
}

export async function verify(hashed: string, plain: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
