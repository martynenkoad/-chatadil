const express = require("express")
const{
    getChats,
    getChat,
    createChat,
    createGroupChat,
    deleteChat,
    updateChat,
    addMember,
    removeMember,
} = require("../controllers/chatController")
const useAuth = require("../middleware/useAuth")

const router = express.Router()
router.use(useAuth)

// Get all chats.
router.get("/", getChats)
// Get a single chat.
router.get("/:chatid", getChat)
// Create a chat for two.
router.post("/", createChat)
// Create a group chat.
router.post("/group-chat", createGroupChat)
// Delete a chat.
router.delete("/:chatid", deleteChat)
// Update a chat.
router.put("/", updateChat)
// Add a new member.
router.put("/add-member", addMember)
// Remove a member.
router.put("/remove-member", removeMember)

module.exports = router