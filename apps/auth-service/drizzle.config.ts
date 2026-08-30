import {defineConfig} from "drizzle-kit";
import {config} from "dotenv";

config({
    path: ".env.local",
    override: true,
});
console.log("DATABASE_URL", process.env.DATABASE_URL);

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!, 
    }
})