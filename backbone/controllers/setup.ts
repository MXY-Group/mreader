// deno-lint-ignore ban-ts-comment
//@ts-nocheck

import { User } from "../../backbone/models/user.ts";
import { Chapter } from "../../backbone/models/chapter.ts";
import { Manga } from "../../backbone/models/manga.ts";

export default function Setup(ctx, db) {
    db.link([User, Chapter, Manga]);
    db.sync({ drop: true });
    ctx.response.body = "Database created!";
}