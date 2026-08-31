import { Router } from "express";
import type { Request, Response } from "express";
import { fromPromise } from "neverthrow";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { hashPassword, comparePassword, signToken } from "@finance-platform/shared-auth";

export const authRouter: Router = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = await fromPromise(
    db.select().from(users).where(eq(users.email, email)),
    () => new Error("Database error"),
  );

  if (existing.isErr()) {
    return res.status(500).json({ error: existing.error.message });
  }
  if (existing.value.length > 0) {
    return res.status(409).json({ error: "User Already exists" });
  }

  const passwordHash = await fromPromise(
    hashPassword(password),
    () => new Error("Password hashing error"),
  );

  if (passwordHash.isErr()) {
    return res.status(500).json({
      error: `Failed to hash password: ${passwordHash.error.message}`,
    });
  }

  const insertedUsers = await fromPromise(
    db
      .insert(users)
      .values({ email, passwordHash: passwordHash.value })
      .returning({ id: users.id, email: users.email }),
    () => new Error("Database error"),
  );

  if (insertedUsers.isErr()) {
    return res.status(500).json({ error: "Failed to create user" });
  }

  const user = insertedUsers.value[0];
  return res.status(201).json({ user });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const selectedUser = await fromPromise(
    db.select().from(users).where(eq(users.email, email)),
    () => new Error("Database Error"),
  );

  if (selectedUser.isErr() || selectedUser.value.length === 0) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const user = selectedUser.value[0];
  const valid = await fromPromise(
    comparePassword(password, user.passwordHash),
    () => new Error("Password verification failed"),
  );

  if (valid.isErr() || !valid.value) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const token = signToken({ user_id: user.id, email: user.email });
  return res
    .status(200)
    .json({ token, user: { id: user.id, email: user.email } });
});
