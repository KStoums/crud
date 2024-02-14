const fastify = require('fastify')({ logger: true });
const fastifyCookie = require('@fastify/cookie');
const cors = require('@fastify/cors');
const { startMongoClient } = require("./mongodb");
const {loginRoute, registerRoute, disconnectRoute, meRoute, editPasswordRoute} = require('./routes');

async function main() {
    if (process.env.HTTP_PORT === undefined || process.env.MONGODB_URI === undefined ||
    process.env.ROOT_URL === undefined || process.env.ROOT_DOMAIN === undefined ||
    process.env.JWT_SECRET === undefined) {
        console.error("> Error: environment are not defined!");
        process.exit(1);
        return;
    }

    if (!await startMongoClient()) {
        process.exit(1);
        return;
    }
    console.info("> Mongo client connected!")

    console.info("> Starting http server...");
    try {
        fastify.register(cors, {
            methods: ["GET", "PUT", "POST", "DELETE"],
            credentials: true,
            origin: process.env.ROOT_URL,
        })

        fastify.register(fastifyCookie);

        const routes = [loginRoute, registerRoute, meRoute, disconnectRoute, editPasswordRoute];
        routes.forEach(route => {
            fastify.route(route);
        })

        await fastify.listen({port: process.env.HTTP_PORT});
        console.info("> Http server started!")
    } catch (error) {
        console.error("> Error when start http server: " + error);
        process.exit(1);
    }
}

main();