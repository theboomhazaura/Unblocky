import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "node:http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

// ONLY import the path helpers that are safe for Node.js
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Manually define paths (DO NOT import epoxy or libcurl here)
const epoxyPath = join(__dirname, "node_modules/@mercuryworkshop/epoxy-transport/dist");
const libcurlPath = join(__dirname, "node_modules/@mercuryworkshop/libcurl-transport/dist");

const bare = createBareServer("/bare/");
const fastify = Fastify({
    serverFactory: (handler) => {
        return createServer()
            .on("request", (req, res) => {
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                if (bare.shouldRoute(req)) bare.routeRequest(req, res);
                else handler(req, res);
            })
            .on("upgrade", (req, socket, head) => {
                if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
                else wisp.routeRequest(req, socket, head);
            });
    },
});

// Serve the files to the browser
fastify.register(fastifyStatic, { root: join(__dirname, "static"), decorateReply: false });
fastify.register(fastifyStatic, { root: baremuxPath, prefix: "/baremux/", decorateReply: false });
fastify.register(fastifyStatic, { root: epoxyPath, prefix: "/epoxy/", decorateReply: false });
fastify.register(fastifyStatic, { root: libcurlPath, prefix: "/libcurl/", decorateReply: false });
fastify.register(fastifyStatic, { root: bareModulePath, prefix: "/baremod/", decorateReply: false });

const PORT = process.env.PORT || 8080;
fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
    if (err) { console.error(err); process.exit(1); }
    console.log(`Server is finally healthy on port ${PORT}`);
});
