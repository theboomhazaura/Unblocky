// ... keep your other imports the same ...

// 1. Updated Transports Section
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// These no longer export a 'path', so we define them manually below
import "@mercuryworkshop/epoxy-transport"; 
import "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
// ... existing imports ...

// Change the transports section to this:
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

// ... the rest of your file is now compatible again ...
// 2. Define the missing paths manually for the Docker environment
const epoxyPath = join(fileURLToPath(new URL(".", import.meta.url)), "node_modules/@mercuryworkshop/epoxy-transport/dist");
const libcurlPath = join(fileURLToPath(new URL(".", import.meta.url)), "node_modules/@mercuryworkshop/libcurl-transport/dist");

// ... keep the Fastify/Bare server logic the same ...

// 3. Updated Static Registrations (ensure these match your existing block)
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
