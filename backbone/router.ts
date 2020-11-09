import { Router } from "../deps.ts";
import { Setup, Scrap } from "../backbone/controllers.ts";
import { db } from "../backbone/db.ts";

const router = new Router();

router.get("/", async (ctx) => {
    ctx.render("test", { data: { name: "John" } });
})
  
router.get("/messy", async (ctx) => {
    ctx.render("test2");
})
  
router.get("/setup", async (ctx) => Setup(ctx, db))

// Scraper of Mangadex

router.get("/scrap/:id/chapter/:chapter", async (ctx) => Scrap(ctx))
router.get("/scrap/:id/chapter/:chapter/download", async (ctx) => Scrap(ctx))
router.get("/scrap/:id/chapter/:chapter/:page", async (ctx) => Scrap(ctx))
router.get("/scrap/:id", async (ctx) => Scrap(ctx))
router.get("/scrap/:id/chapters", async (ctx) => Scrap(ctx))

export default router;