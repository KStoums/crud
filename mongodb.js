const {MongoClient} = require("mongodb");
const {userModel} = require("./model");
const {hashPassword, compareHash} = require("./utils");

let mongoClient;

async function startMongoClient() {
    try {
        mongoClient = new MongoClient(process.env.MONGODB_URI);
        return true;
    } catch (error) {
        console.error("> Error when start mongo client: " + error);
        return false;
    }
}

function getUsersCollection() {
    return mongoClient.db("crud").collection("users");
}

async function getUserByEmail(email) {
    try {
        return await getUsersCollection().findOne({email: email});
    } catch (error) {
        console.error("> Error when find user in mongodb: " + error);
        return null;
    }
}

async function getUserByUsername(username) {
    try {
        return await getUsersCollection().findOne({username: username});
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

        await getUsersCollection().insertOne(newUser);
        return true;
    } catch (error) {
        console.error("Error when insert new user into mongodb: " + error);
        return false;
    }
}

async function editUserPassword(email, newPassword) {
    let user = await getUserByEmail(email);

    if (user === null) {
        throw new Error("User not found into mongodb");
    }

    const isEqual = await compareHash(newPassword, user.password);

    if (isEqual) {
        throw new Error("Old password is equal to new");
    }

    try {
        await getUsersCollection().updateOne({email: email}, {$set: {password: await hashPassword(newPassword)}});
    } catch (error) {
        throw error;
    }
}

module.exports = { getUserByEmail, getUserByUsername, createUser, editUserPassword, startMongoClient }