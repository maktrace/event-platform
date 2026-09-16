import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import {
  comparePassword,
  hashPassword,
} from "../utils/password";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const email = data.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name.trim(),
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await comparePassword(
    password,
    user.password
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};