import bcrypt from "bcryptjs";

const checkPassword = async (password, hashedPassword) => {
  const corrcetPassword = await bcrypt.compare(password, hashedPassword);
  return corrcetPassword;
}

export default checkPassword;