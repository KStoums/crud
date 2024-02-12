const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    if (password === "") {
        return undefined;
    }

    return await bcrypt.hash(password, 10);
}

async function compareHash(password, hashedPassword) {
    try {
        return await bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        console.error("Error when compare hash: " + error);
        return false;
    }
}

function createJwtToken(email) {
    return jwt.sign({email: email}, process.env.JWT_SECRET);
}

module.exports = { hashPassword, compareHash, createJwtToken };