import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");
const worker =
  "const HTML = " + JSON.stringify(html) + ";\n\n" +
  "export default {\n" +
  "  async fetch(request) {\n" +
  "    const url = new URL(request.url);\n" +
  "    if (url.pathname === '/' || url.pathname === '/index.html') {\n" +
  "      return new Response(HTML, {\n" +
  "        headers: {\n" +
  "          'content-type': 'text/html; charset=utf-8',\n" +
  "          'cache-control': 'public, max-age=300'\n" +
  "        }\n" +
  "      });\n" +
  "    }\n" +
  "    return new Response('Not Found', { status: 404 });\n" +
  "  }\n" +
  "};\n";

await mkdir(new URL("./dist/server/", import.meta.url), { recursive: true });
await mkdir(new URL("./dist/client/", import.meta.url), { recursive: true });
await writeFile(new URL("./dist/server/index.js", import.meta.url), worker, "utf8");
await copyFile(
  new URL("./index.html", import.meta.url),
  new URL("./dist/client/index.html", import.meta.url)
);
