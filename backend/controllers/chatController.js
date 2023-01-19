const { default: mongoose } = require("mongoose")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const {
    success, 
    fail
} = require("../utils/response")

/**
 * @description    Get all chats.
 * @route          GET /api/chat
 * @param          req 
 * @param          res 
 */
const getChats = async (req, res) => {
    const { _id } = req.user

    try {
        const chats = await Chat.find({
            members: { $elemMatch: { $eq: _id } }
        })
          .populate("members", "-password")
          .populate("admin", "-password")
          .populate("lastMessage")
          .sort({ createdAt: -1 })

        if(!chats) {
            return fail(res, "No chats yet.", 404)
        }

        const fullChats = await User.populate(chats, {
            path: "lastMessage.from",
            select: "username profileImage"
        })

        success(res, fullChats)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Get a single chat.
 * @route          GET /api/chat/:chatid
 * @param req      req.params.chatid is required.
 * @param res      returns a found chat.
 */
const getChat = async (req, res) => {
    const { chatid } = req.params


    try {
        const chat = await Chat.findOne({ _id: chatid })
          .populate("members", "-password")
          .populate("admin", "-password")

        if(!chat) {
            return fail(res, "Chat not found.", 404)
        }

        success(res, chat)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Create a chat for two users.
 * @route          POST /api/chat/
 * @param req      req.body.userId, req.user._id are required.
 * @param res      returns created/found chat for two.
 */
const createChat = async (req, res) => {
    const { userId } = req.body
    const { _id } = req.user
    
    try {
        const chat = await Chat.findOne({
            isGroupChat: false,
            $and: [{
                members: { $elemMatch: { $eq: userId } }
            }, {
                members: { $elemMatch: { $eq: _id } }
            }]
        })
          .populate("members", "-password")
          .populate("lastMessage")
          .populate("lastMessage.from", "-password")

        
        if(chat) {
            return success(res, fullChat)
        }

        const user = await User.findOne({ _id: userId })

        if(!user) {
            return fail(res, "No such user found.", 404)
        }

        const chatData = {
            chatName: user.username,
            chatImage: { 
                public_id: "",
                url: ""
            },
            description: "",
            members: [userId, _id],
            isGroupChat: false,
            isChannel: false
        }

        const newChat = await Chat.create(chatData)

        const createdChat = await Chat.findOne({ _id: newChat._id })
          .populate("members", "-password")
        
        success(res, createdChat)
       
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Create a group chat.
 * @route          POST /api/chat/group-chat
 * @param req      req.body.{ members, chatName, isChannel }, req.user._id are required. optional: req.body.{ chatImage, description }
 * @param res      returns a group chat.
 */
const createGroupChat = async (req, res) => {
    const { members, chatName, description, chatImage, isChannel } = req.body
    members.push(req.user._id)

    if(!chatName) {
        return fail(res, "Your group chat must have the name.")
    }

    if(!isChannel && members.length < 3) {
        return fail(res, "Your Group Chat must contain 3+ users.")
    } 

    try {
        const chatData = {
            chatName,
            description,
            chatImage,
            isGroupChat: true,
            isChannel,
            members,
            admin: req.user
        }

        const newChat = await Chat.create(chatData)

        const chat = await Chat.findOne({ _id: newChat._id })
          .populate("admin", "-password")
          .populate("members", "-password")

        success(res, chat)
    } catch (error) {
        fail(res, error.message)
    }
}


/**
 * @description    Delete the chat.
 * @route          DELETE /api/chat/:chatid
 * @param req      req.params.chatid is required.
 * @param res      returns a deleted chat.
 */
const deleteChat = async (req, res) => {
    const { chatid } = req.params

    if(!mongoose.Types.ObjectId.isValid(chatid)) {
        return fail(res, "Bad request.")
    }

    try {
        const chat = await Chat.findOneAndDelete({ _id: chatid })

        if(!chat) {
            return fail(res, "Chat not found.", 404)
        }
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Update the chat's name/image/description.
 * @route          PUT /api/chat/
 * @param req      req.body.chatId is required. optional: req.body.{ chatName, chatImage, description, members }.
 * @param res      returns an updated chat.
 */
const updateChat = async (req, res) => {
    const { chatId, chatName, chatImage, description, members } = req.body

    try {
        const chat = await Chat.findById(chatId)
          .populate("members", "-password")
          .populate("admin", "-password")
          .populate("lastMessage")

        if(!chat) {
            return fail(res, "Chat not found.", 404)
        }

        chat.chatName = chatName || chat.chatName
        chat.chatImage = chatImage.url ? chatImage : chat.chatImage
        chat.description = description || chat.description
        chat.members = members || chat.members

        const updated = await chat.save()

        success(res, updated)
    } catch (error) {
        fail(res, error.message)
    }
}


/**
 * @description    Add the member to the chat.
 * @route          PUT /api/chat/add-member
 * @param req      req.body.{ chatId, userId } are required.
 * @param res      returns a chat with updated members.
 */
const addMember = async (req, res) => {
    const { chatId, userId } = req.body


    try {
        const chat = await Chat.findByIdAndUpdate(chatId, {
            $push: { members: userId }
        }, { new: true })
          .populate("members", "-password")
          .populate("admin", "-password")
        
        if(!chat) {
            return fail(res, "Chat not found", 404)
        }

        success(res, chat)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Remove the member from the chat.
 * @route          PUT /api/chat/remove-member
 * @param req      req.body.{ chatId, userId } are required.
 * @param res      returns a chat with updated members.
 */
const removeMember = async (req, res) => {
    const { chatId, userId } = req.body

    

    try {
        const chat = await Chat.findByIdAndUpdate(chatId, {
            $pull: { members: userId }
        }, { new: true })
          .populate("members", "-password")
          .populate("admin", "-password")
        
        if(!chat) {
            return fail(res, "Chat not found", 404)
        }

        success(res, chat)
    } catch (error) {
        fail(res, error.message)
    }
}

module.exports = {
    getChats,
    getChat,
    createChat,
    createGroupChat,
    deleteChat, 
    updateChat,
    addMember,
    removeMember
}