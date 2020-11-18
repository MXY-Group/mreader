// deno-lint-ignore ban-ts-comment
//@ts-nocheck

import { ensureDirSync } from "../../deps.ts";
import Chapter from "../models/chapter.ts";
import Manga from "../models/manga.ts";

export default async function Scrap(ctx, db) {
    try {
        const regexc = /\/chapters/;

        if(ctx.params.id && ctx.params.chapter) {
            const jsona = await fetch(`https://mangadex.org/api/v2/chapter/${ctx.params.chapter}?saver=0`);
            const jsondata = await jsona.json();

            if(ctx.params.page) {
                // deno-lint-ignore no-inner-declarations
                var page = 0;
                
                if(ctx.params.page == 0 || ctx.params.page == 1) {
                    page = 0
                } else {
                    page = ctx.params.page;
                }

                // deno-lint-ignore no-inner-declarations
                var url = jsondata.data['pages'][page];

                // deno-lint-ignore no-inner-declarations
                var server = jsondata.data['server'];

                // deno-lint-ignore no-inner-declarations
                var hsh = jsondata.data['hash'];

                const img = await fetch(`${server}${hsh}/${url}`);
                
                if(img.ok) {
                    const imgbuf = await img.arrayBuffer();
                    const imgbuf2 = new Uint8Array(imgbuf);

                    ctx.response.headers.set('Content-Type', 'image/png');
                    ctx.response.body = imgbuf2;
                } else {
                    ctx.response.body = "No Page Found";
                }

            } else {

                const regexcd = /\/download/;

                if(regexcd.exec(ctx.request.url)) {
                    await db.link([Manga, Chapter]);

                    const jsonac = await fetch(`https://mangadex.org/api/v2/manga/${ctx.params.id}`);
                    const jsondatac = await jsonac.json();

                    const chapters = await fetch(`https://mangadex.org/api/v2/manga/${ctx.params.id}/chapters`);
                    const chapterdata = await chapters.json();

                    const chapter = chapterdata.data['chapters'].filter(chapter => chapter.id == ctx.params.chapter);

                    await jsondata.data['pages'].forEach(async (page) => {

                        var server = jsondata.data['server'];

                        var hsh = jsondata.data['hash'];

                        const img = await fetch(`${server}${hsh}/${page}`);
                        const imgbuf = await img.arrayBuffer();
                        const imgbuf2 = new Uint8Array(imgbuf);

                        await ensureDirSync(`${Deno.cwd()}/static/mangas/${jsondatac.data['title']}/chapters/${chapter[0].title}`);

                        await Deno.writeFile(`${Deno.cwd()}/static/mangas/${jsondatac.data['title']}/chapters/${chapter[0].title}/${page}`, imgbuf2).then((file) => console.log(`${page} has been written.`));
                    })

                    const mangac = await Manga.where('title', jsondatac.data['title']).get();

                    if(mangac.length == 0) {

                        await Manga.create({
                            "title": jsondatac.data['title'],
                            "status": "Ongoing",
                            "totalchapters": chapterdata.data['chapters'].filter(chapter => chapter.language == 'gb').length,
                            "chapters": 1
                        });
    
                        await Chapter.create({
                            "title": chapter[0].title,
                            "uploader": 0,
                            "manga": 1
                        });

                        const img = await fetch(`https://mangadex.org/images/manga/${ctx.params.id}.jpg`);
                        const imgbuf = await img.arrayBuffer();
                        const imgbuf2 = new Uint8Array(imgbuf);
                        await Deno.writeFile(`${Deno.cwd()}/static/mangas/${jsondatac.data['title']}/cover.jpg`, imgbuf2);

                    } else {

                        await Chapter.create({
                            "title": chapter[0].title,
                            "uploader": 0,
                            "manga": 1
                        });
                        
                    }

                    ctx.response.body = "Done";

                } else {

                    // deno-lint-ignore no-inner-declarations no-redeclare
                    var url = jsondata.data['pages'][0];

                    // deno-lint-ignore no-inner-declarations no-redeclare
                    var server = jsondata.data['server'];

                    // deno-lint-ignore no-inner-declarations no-redeclare
                    var hsh = jsondata.data['hash'];

                    const img = await fetch(`${server}${hsh}/${url}`);
                    const imgbuf = await img.arrayBuffer();
                    const imgbuf2 = new Uint8Array(imgbuf);

                    ctx.response.headers.set('Content-Type', 'image/png');
                    ctx.response.body = imgbuf2;

                }
                
            }

        } else if(ctx.params.id && regexc.exec(ctx.request.url)) {
            const jsona = await fetch(`https://mangadex.org/api/v2/manga/${ctx.params.id}/chapters`);
            const jsondata = await jsona.json();

            ctx.response.body = jsondata.data;

        } else if(ctx.params.id) {
            const jsona = await fetch(`https://mangadex.org/api/v2/manga/${ctx.params.id}`);
            const jsondata = await jsona.json();

            ctx.response.body = jsondata.data;

        }

      } catch (err) {
          console.log(err);
      }
}
