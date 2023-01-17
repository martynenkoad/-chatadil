const express = require("express")
const {
    logInUser,
    signUpUser,
    getUsers,
    editProfile,
    forgotPassword,
    resetPassword,
    getQuestions,
    findUser
} = require("../controllers/userController")
const useAuth = require("../middleware/useAuth")

const router = express.Router()

// Log in the user.
router.post("/login", logInUser)
// Sign up the user.
router.post("/signup", signUpUser)
// Get the list of all users.
router.get("/", useAuth, getUsers)
// Update a user's information.
router.put("/edit-profile", useAuth, editProfile)
// Handle forgot password issue.
router.post("/forgot-password", forgotPassword)
// Reset the password of the user.
router.post("/reset-password", useAuth, resetPassword)
// Send the questions about Chatadil to the developer.
router.post("/send-question", getQuestions)
// Find a user.
router.get("/find-user", useAuth, findUser) 

module.exports = router