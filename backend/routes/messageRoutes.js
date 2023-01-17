const express = require("express")
const {
    getMessages,
    sendMessage,
    sendVoiceMessage,
    deleteMessage,
    readMessage,
    updateMessage,
    likeMessage,
    unlikeMessage
} = require("../controllers/messageController")
const useAuth = require("../middleware/useAuth")
const multer = require("multer")

const router = express.Router()
router.use(useAuth)

const upload = multer()

// Get paginated messages of a chat.
router.get("/", getMessages)
// Send a new message.
router.post("/:chat", sendMessage)
// Send a new voice message.
router.post("/voice/:chat", upload.single("voiceMessage"), sendVoiceMessage)
// Delete a message.
router.delete("/:id", deleteMessage)
// Mark messages is chat as read.
router.put("/read/:chatid", readMessage)
// Update a message.
router.put("/update/:messageid", updateMessage)
// Like a message.
router.put("/like-message/:messageid", likeMessage)
// Unlike a message.
router.put("/unlike-message/:messageid", unlikeMessage)

module.exports = router