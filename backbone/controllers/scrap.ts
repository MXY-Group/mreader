// deno-lint-ignore ban-ts-comment
//@ts-nocheck

import { ensureDirSync } from "../../deps.ts";

export default async function Scrap(ctx) {
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

                    const jsonac = await fetch(`https://mangadex.org/api/v2/manga/${ctx.params.id}`);
                    const jsondatac = await jsonac.json();

                    await jsondata.data['pages'].forEach(async (page) => {

                        var server = jsondata.data['server'];

                        var hsh = jsondata.data['hash'];

                        const img = await fetch(`${server}${hsh}/${page}`);
                        const imgbuf = await img.arrayBuffer();
                        const imgbuf2 = new Uint8Array(imgbuf);

                        await ensureDirSync(`${Deno.cwd()}/mangas/${jsondatac.data['title']}/chapters/${ctx.params.chapter}`);

                        await Deno.writeFile(`${Deno.cwd()}/mangas/${jsondatac.data['title']}/chapters/${ctx.params.chapter}/${page}`, imgbuf2).then((file) => console.log(`${page} has been written.`));
                    })

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