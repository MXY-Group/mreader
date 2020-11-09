// deno-lint-ignore ban-ts-comment
//@ts-nocheck

import { User } from "../../backbone/models/user.ts";

export default function Setup(ctx, db) {
    db.link([User]);
    db.sync({ drop: true });
    ctx.response.body = "Database created!";
}