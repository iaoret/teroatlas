import { Client } from "pg";

import { config } from "dotenv";
import { logError } from "../logger";
import dayjs from "dayjs";

config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function connectDB() {
  try {
    await client.connect();
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(`[${timestamp}] info: Connected to database`);
  } catch (error) {
    logError(error, "DB");
    process.exit(1); // Exit the process if DB connection fails
  }
}

export default client;
