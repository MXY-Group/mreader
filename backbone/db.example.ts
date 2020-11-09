import { Database } from "../deps.ts";

export const db = new Database({ dialect: "mysql", debug: true }, {
    database: 'dbname',
    host: 'localhost',
    username: 'user',
    password: 'pass'
});