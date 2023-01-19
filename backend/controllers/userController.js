const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const {
    success,
    fail
} = require("../utils/response")
const sendMails = require("../middleware/sendMail")
const { 
    setPasswordRecoveryMail,
    setSupportEmail
} = require("../utils/setMailOptions")
const bcrypt = require("bcrypt")

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: '3d' })
}

/**
 * @description    Sign up the user.
 * @route          POST /api/user/signup
 * @param req      req.body.{ firstName, lastName, username, email, password, profileImage } are required.
 * @param res      returns a new user with token.
 */
const signUpUser = async (req, res) => {
    const { firstName, lastName, username, email, password, profileImage } = req.body

    try {
        const user = await User.signup(firstName, lastName, username, email, password, profileImage)
        const token = createToken(user._id) 

        success(res, { firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, profileImage: user.profileImage, token, _id: user._id })
    } catch (error) {
        fail(res, error.message)
    }
} 

/**
 * @description    Log in the user.
 * @route          POST /api/user/login
 * @param req      req.body.{ email, password } are required.
 * @param res      returns a user with token.
 */
const logInUser = async (req, res) => {
    const { email, password } = req.body

    try {            
        const user = await User.login(email, password)
        const token = createToken(user._id)

        success(res, { firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, profileImage: user.profileImage, token, _id: user._id })
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Get the list of all the users.
 * @route          GET /api/user/
 * @param req 
 * @param res      returns a list of all users. 
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find({  }).sort({ createdAt: 1 })
          .select("-password")
        success(res, users)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Edit the profile information of the user.
 * @route          PUT /api/user/edit-profile
 * @param req      req.user._id is required. optional: req.body.{ firstName, lastName, username, profileImage }.
 * @param res      returns an updated user.
 */
const editProfile = async (req, res) => {
    const { firstName, lastName, username, profileImage } = req.body

    try {
        const user = await User.findOne({ _id: req.user._id })

        if(!user) {
            return fail(res, "Such user does not exist.", 404)
        }

        const updated = await User.findByIdAndUpdate(req.user._id, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            username: username || user.username,
            profileImage: profileImage.url ? profileImage : user.profileImage
        }, { new: true })
            // profileImage: profileImage || user.profileImage,

        const token = createToken(updated._id)

        success(res, {
            firstName: updated.firstName,
            lastName: updated.lastName,
            username: updated.username,
            profileImage: updated.profileImage,
            email: updated.email,
            _id: updated._id,
            token,
            isAdmin: updated.isAdmin
        })

    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Sends the email with reset-password link to the user who requested to reset their password.
 * @route          POST /api/user/forgot-password
 * @param req      req.body.email is required.
 * @param res      returns a message for user to check their emails.
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body

    if(!email) {
        return fail(res, "Bad request.")
    }

    try {
        const user = await User.findOne({ email })        

        if(!user) {
            return fail(res, "Such user does not exist.", 404)
        }

        const accessToken = createToken(user._id)

        const url = `${process.env.FRONTEND_URL}/password-recovery/${accessToken}`
        const options = setPasswordRecoveryMail(email, user.username, url)

        sendMails(options)

        success(res, { message: "Please check our email!" })
    } catch (error) {
        fail(res, error.message)
    }
} 

/**
 * @description    Reset the password of the user.
 * @route          POST /api/user/reset-password
 * @param req      req.body.password is required.
 * @param res      returns an updated user.
 */
const resetPassword = async (req, res) => {
    const { password } = req.body

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await User.findByIdAndUpdate(req.user._id, {
            password: hash
        }) 

        if(!user) {
            return fail(res, "Such user does not exist.", 404)
        }

        success(res, user)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Send a question to the email of developer.
 * @route          POST /api/user/send-question
 * @param req      req.body.{ name, email, question } are required.
 * @param res      returns a message to user that the question is already sent.
 */
const getQuestions = async (req, res) => {
    const { name, email, question } = req.body
    
    if(!name || !email || !question) {
        return fail(res, "All fields must be filled.")
    }

    try {
        const options = setSupportEmail(email, name, question)

        sendMails(options)
        success(res, { message: "Your question was successfully sent! Please wait for the response :)" })
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Finds the user by given options.
 * @route          GET /api/user/find-user?search={search}&chatid={chatid}
 * @param req      req.query.search, req.query.chatid are required.
 * @param res      returns found users.
 */
const findUser = async (req, res) => {

    const keyword = {
        $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    }

    const chatid = req.query.chatid
    const { members } = await Chat.findOne({ _id: chatid })
    
    let membersInCurrentChat = []
    members.map(singleMember => {
        membersInCurrentChat.push(singleMember._id)
    })

    membersInCurrentChat.push(req.user._id)

    const users = await User.find(keyword).find({ _id: { $nin: membersInCurrentChat } }).limit(10)

    success(res, users)
}

module.exports = {
    logInUser,
    signUpUser,
    getUsers,
    editProfile,
    forgotPassword,
    resetPassword,
    getQuestions,
    findUser
}