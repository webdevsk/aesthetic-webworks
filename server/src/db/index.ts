import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
export const db = drizzle(process.env.DATABASE_URL!, { schema })
