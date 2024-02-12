const { MongoClient } = require("mongodb");
const { userModel } = require("./model");
const { hashPassword } = require("./utils.js");

let mongoDbClient;

async function startMongoClient() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        console.info("> Mongo client connected!")
        mongoDbClient = client;
    } catch (error) {
        console.error("> Error when start mongo client: " + error);
    }
}

async function getUserByEmail(email) {
    try {
        return await mongoDbClient.db("crud").collection("users").findOne({email: email});
    } catch (error) {
        console.error("> Error when find user in mongodb: " + error);
        return null;
    }
}

async function getUserByUsername(username) {
    try {
        return await mongoDbClient.db("crud").collection("users").findOne({username: username});
    } catch (error) {
        console.error("> Error when find user in mongodb: " + error);
        return null;
    }
}

async function createUser(username, email, password) {
    let newUser = new userModel;

    try {
        newUser.username = username;
        newUser.email = email;
        newUser.password = await hashPassword(password);

        await mongoDbClient.db("crud").collection("users").insertOne(newUser);
        return true;
    } catch (error) {
        console.error("Error when insert new user into mongodb: " + error);
        return false;
    }
}

module.exports = { startMongoClient, getUserByEmail, getUserByUsername, createUser }