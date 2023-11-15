import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 3;

/**
 * @params plainPassword: supplied when signup
 */
export async function hashPasswordBcrypt(plainPassword: string) {
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash;
}

/**
 * @params plainPassword: supplied when login
 * @params hashedPassword: looked up from database
 */
export async function checkPasswordBcrypt(
  plainPassword: string,
  hashedPassword: string,
) {
  const isMatched: boolean = await bcrypt.compare(
    plainPassword,
    hashedPassword,
  );
  return isMatched;
}
