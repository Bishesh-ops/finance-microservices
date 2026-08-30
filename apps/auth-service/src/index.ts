import express from "express";
import type { Request, Response } from "express";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "Ok", services: "auth-service" });
});
app.get("/db-check", async (_req: Request, res: Response) => {
  const result = await db.select().from(users);
  res.json({count: result.length});
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`auth-service running on port ${PORT}`);
});
