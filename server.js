import { createBareServer } from "@nebula-services/bare-server-node";
import { createServer } from "node:http";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

// Transports
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Initialize Bare Server
const bare = createBareServer("/bare/", {
    logErrors: true,
    blockLocal: false,
});

// Configure Wisp
wisp.options.allow_loopback_ips = true;
wisp.options.allow_private_ips = true;

const fastify = Fastify({
    serverFactory: (handler) => {
        return createServer()
            .on("request", (req, res) => {
                // Add security headers for Service Workers
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

                if (bare.shouldRoute(req)) {
                    bare.routeRequest(req, res);
                } else {
                    handler(req, res);
                }
            })
            .on("upgrade", (req, socket, head) => {
                if (bare.shouldRoute(req)) {
                    bare.routeUpgrade(req, socket, head);
                } else {
                    wisp.routeRequest(req, socket, head);
                }
            });
    },
});

// Static File Routing
fastify.register(fastifyStatic, {
    root: join(__dirname, "static"),
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: join(__dirname, "dist"),
    prefix: "/scram/",
    decorateReply: false,
});

// Transport Routing
fastify.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/baremux/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/epoxy/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: libcurlPath,
    prefix: "/libcurl/",
    decorateReply: false,
});

fastify.register(fastifyStatic, {
    root: bareModulePath,
    prefix: "/baremod/",
    decorateReply: false,
});

// Port configuration for Koyeb
const PORT = process.env.PORT || 8080;

fastify.listen({
    port: PORT,
    host: "0.0.0.0",
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`🚀 Server listening on ${address}`);
});

// Fallback handler
fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not Found");
});
