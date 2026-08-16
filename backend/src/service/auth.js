const httpStatus = require("../constants/httpStatus");
const { User, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerUser = async (userData) => {
    let userExists = await User.findOne({
        where: {
            email: userData.email
        }
    })
    if (userExists) {
        let error = new Error("User already exists");
        error.statusCode = httpStatus.CONFLICT;
        throw error
    }
    const role = await Role.findOne({
        where: {
            id: userData.role_id
        }
    })
    if (!role) {
        const error = new Error("Invalid or inactive role");
        error.statusCode = httpStatus.BAD_REQUEST;
        throw error;
    }
    const user = await User.create({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        role_id: userData.role_id
    })
    if (!user) {
        let error = new Error("Failed to create the user");
        error.statusCode = 500
        throw error
    }
    return user


}


const loginUser = async (userData) => {
    let userExists = await User.findOne({
        where: {
            email: userData.email
        }
    })
    if (!userExists) {
        let error = new Error("User not found,plz register");
        error.statusCode = httpStatus.BAD_REQUEST;
        throw error
    }
    let passwordcheck = await bcrypt.compare(userData.password, userExists.password);
    if (!passwordcheck) {
        throw new Error("Please provide correct password")
    };
    let token = jwt.sign({ id: userExists.id, role_id: userExists.role_id, email: userExists.email }, process.env.SECREAT_KEY, { expiresIn: "1h" })
    if (!token) {
        throw new Error("Failed to create token")
    }
    return token
}

module.exports = { registerUser, loginUser }