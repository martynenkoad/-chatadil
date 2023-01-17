const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

/**
 * @description    Middleware to check if the user is authenticated.
 * @param req      req.headers.authorization is required.
 * @param res 
 * @param next 
 */
const useAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization) {
        throw Error("You must be authorized to continue.")
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = await User.findOne({ _id }).select("_id")
        next()
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = useAuth
