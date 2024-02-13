const fastify = require('fastify')({ logger: true });
const fastifyCookie = require('fastify-cookie');
const cors = require('@fastify/cors');
const { startMongoClient } = require("./mongodb.js");
const { loginRoute, registerRoute, meRoute, disconnectRoute, editPasswordRoute } = require("./routes.js");

checkEnvironments();

(async() => {
    await startMongoClient();
    await startHttpServer();
})()

async function startHttpServer() {
    console.info("> Starting http server...");

    try {
        fastify.register(cors, {
            methods: ["GET", "PUT", "POST", "DELETE"],
            credentials: true,
            origin: process.env.ROOT_URL,
        })

        fastify.register(fastifyCookie);

        fastify.route(loginRoute);
        console.info("> \"/login\" route registered!");

        fastify.route(registerRoute);
        console.info("> \"/register\" route registered!");

        fastify.route(meRoute);
        console.info("> \"/me\" route registered!");

        fastify.route(disconnectRoute);
        console.info("> \"/disconnect\" route registered!");

        fastify.route(editPasswordRoute);
        console.info("> \"/password\" route registered!");

        await fastify.listen({port: process.env.HTTP_PORT});
        console.info("> Http server started!")
    } catch (error) {
        console.error("> Error when start http server: " + error);
        process.exit(1);
    }
}

function httpMiddleware(request, reply) {}

function checkEnvironments() {
    if (process.env.HTTP_PORT === undefined || process.env.MONGODB_URI === undefined) {
        console.error("> Error: environment HTTP_PORT or MONGODB_URI are not defined!");
        process.exit(1);
    }
}