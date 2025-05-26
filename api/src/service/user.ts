import client from "./db";
import md5 from "md5";

export async function findUserByUsername(username: string) {
  const res = await client.query(
    "SELECT * FROM admin.users WHERE username = $1",
    [username]
  );
  return res.rows[0];
}

export async function createUser(
  username: string,
  password: string,
  su: boolean = false
) {
  const hash = md5(password);
  const res = await client.query(
    `INSERT INTO admin.users (username, password, su) VALUES ($1, $2, $3) RETURNING *`,
    [username, hash, su]
  );
  return res.rows[0];
}

export async function initAdminUser() {
  const res = await client.query(
    `SELECT * FROM admin.users WHERE username = 'admin'`
  );
  if (res.rows.length === 0) {
    await createUser("admin", "admin", true);
    console.log("[DB] Admin user created");
  }
}
