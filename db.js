import { createConnection } from "mysql2";

const db = createConnection({
  host: "187.127.131.17",
  user: "career_user",
  password: "career4sl1234",
  database: "db_4sl_career_plus"
});

export default db;