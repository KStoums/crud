const { userModel } = require("./model.js");
const { hashPassword, compareHash, createJwtToken } = require("./utils.js");
const { getUserByEmail, getUserByUsername, createUser } = require("./mongodb.js");
const {verify} = require("jsonwebtoken");

const loginRoute = {
    method: 'POST',
    url: '/login',
    schema: {
        response: {
            200: {},
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
            400: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
        }
    },
    handler: async function loginHandler(request, response) {
        const {email, password} = request.body;
        const hashedPassword = await hashPassword(password);
        const user = await getUserByEmail(email);

        if (user === null) {
            response.status(404).send({error: "Email address or password do not match or account does not exist"});
            return;
        }

        try {
            if (!await compareHash(password, hashedPassword)) {
                response.status(400).send({error: "Email address or password do not match or account does not exist"});
                return;
            }

            const token = createJwtToken(email);
            response.setCookie("crud", token, {
                path: "/",
                domain: process.env.ROOT_DOMAIN,
                expires: new Date(Date.now() + 900000), //900000 = 15 minutes
                httpOnly: true,
            }).send(200);
        } catch (error) {
            response.status(400).send({error: "Error when compareHash: " + error});
        }
    }
}

const registerRoute = {
    method: 'POST',
    url: '/register',
    schema: {
        response: {
            200: {},
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
            400: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
        }
    },
    handler: async function registerHandler(request, response) {
        const {username, email, password} = request.body;

        try {
            const userByEmail = await getUserByEmail(email);
            const userByUsername = await getUserByUsername(username);

            if (userByEmail !== null || userByUsername !== null) {
                response.status(400).send({error: "An account with this email address or username already exists"});
                return;
            }

            if (!await createUser(username, email, password)) {
                response.status(400).send({error: "Error when add user into mongodb"});
                return;
            }

            response.send(200);
        } catch (error) {
            console.error("Error when check or create new user into mongodb: " + error);
            response.status(400).send({error: "Error when check or create new user into mongodb: " + error});
        }
    }
}

const meRoute = {
    method: 'GET',
    url: '/me',
    schema: {
        response: {
            200: {},
            419: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
        }
    },
    preHandler: middleware,
    handler: async function meHandler(request, response) {
        response.send(200);
    }
}

const disconnectRoute = {
    method: 'POST',
    url: '/disconnect',
    schema: {
        response: {
            200: {},
            419: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            },
        }
    },
    preHandler: middleware,
    handler: async function meHandler(request, response) {
        response.setCookie("crud", "", {
            path: "/",
            domain: process.env.ROOT_DOMAIN,
            expires: new Date(Date.now() -1),
            httpOnly: true,
        }).send(200);
    }
}

async function middleware(request, response, next) {
    const crudCookie = request.cookies["crud"];

    if (crudCookie === undefined) {
        response.status(419).send({error:"Your session has expired, please log in again."});
        return;
    }

    const {email} = verify(crudCookie, process.env.JWT_SECRET);

    try {
        const user = await getUserByEmail(email);

        if (user === null) {
            response.status(419).send({error:"Your session has expired, please log in again."});
            return;
        }
    } catch (error) {
        response.status(400).send({error:"Error when get user into mongodb: " + error});
        return;
    }

    next();
}

module.exports = { loginRoute, registerRoute, meRoute, disconnectRoute };