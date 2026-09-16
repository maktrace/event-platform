import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      res.status(400).json({
        message: "Name must contain at least 2 characters",
      });
      return;
    }

    if (
      typeof email !== "string" ||
      !email.includes("@")
    ) {
      res.status(400).json({
        message: "Valid email is required",
      });
      return;
    }

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
      return;
    }

    const result = await registerUser({
      name,
      email,
      password,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof password !== "string" ||
      !password
    ) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
};