const mongoose = require("mongoose")
const imageSchema = require("./imageSchema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const {
    isLetters,
    replaceSpaces,
    isUsername,
    generatePassword,
    generateRandomUsername
} = require("../utils/stringRoutines")

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    profileImage: {
        type: imageSchema,
        default: {
            public_id: "",
            url: ""
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


userSchema.statics.signup = async function(firstName, lastName, username, email, password, profileImage) {
    const _firstName = replaceSpaces(firstName)
    const _lastName = replaceSpaces(lastName)
    const _username = replaceSpaces(username)

    const emailExists = await this.findOne({ email })

    if(!firstName || !lastName || !username || !email || !password) {
        throw Error("All fields must be filled.")
    }

    if(!validator.isStrongPassword(password)) {
        throw Error("Please select the strong password.")
    } 

    if(!validator.isEmail(email)) {
        throw Error("Please make sure that your email is correct.")
    }


    if(!isUsername(_username)) {
        throw Error("Please choose another username.")
    }

    if(emailExists) {
        throw Error("Such user is already logged in.")
    }

    if(!isLetters(_firstName) || !isLetters(_lastName)) {
        throw Error("Please make sure that your first & last name are correct.")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({
        firstName: _firstName,
        lastName: _lastName,
        username: _username,
        email,
        password: hash,
        profileImage,
        isAdmin: false
    })

    return user
}


userSchema.statics.login = async function(email, password) {
    if(!email || !password) {
        throw Error("All fields must be filled.")
    }

    const user = await this.findOne({ email })

    if(!user) {
        throw Error("Oops! Such user does not exist.")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error("Please type the correct password.")
    }

    return user
}


module.exports = mongoose.model("User", userSchema)

