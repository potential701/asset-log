import * as bcrypt from "bcrypt";

const saltRounds = 10;

export async function hash(input: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(input, salt);
}

export async function verify(source: string, target: string) {
  try {
    return await bcrypt.compare(source, target);
  } catch {
    return false;
  }
}
