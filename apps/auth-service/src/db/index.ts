import { createDb } from "@finance-platform/db-client";

export const db = createDb(process.env.DATABASE_URL!);