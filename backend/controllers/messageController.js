const Message = require("../models/messageModel")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const {
    success,
    fail
} = require("../utils/response")
const {
    getData,
    uploadImages,
    uploadAudio
} = require("../middleware/upload")
const mongoose = require("mongoose")
 
/**
 * @description    Get the paginated messages from chat.
 * @route          GET /api/message?chat={chat}&limit={limit}&page={page}
 * @param req      req.query.{ chat, limit, page } are required.
 * @param res      returns messages of current page of current chat & count of max pages.
 */
const getMessages = async (req, res) => {
    const { chat, limit, page } = req.query

    if(!chat || !mongoose.Types.ObjectId.isValid(chat)) {
        return fail(res, "Bad request.")
    }
    
    try {

        const totalMessages = await Message.count({ chat })
        const totalPages = totalMessages / limit

        const messages = await Message.find({ chat })
          .populate("from", "-password")
          .populate("chat")
          .populate("replyToMessage")
          .populate("forwardedMessage")
          .sort({ createdAt: -1 })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .lean()
          .exec()

        messages.reverse()

        const almostFinalMessages = await User.populate(messages, {
            path: "replyToMessage.from",
            select: "username _id"
        })

        const finalMessages = await User.populate(almostFinalMessages, {
            path: "forwardedMessage.from",
            select: "username email _id firstName lastName profileImage"
        })

        success(res, {
            messages: finalMessages,
            totalPages: Math.ceil(totalPages)
        })
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Send the message.
 * @route          POST /api/message/:chat
 * @param req      req.params.chat, FormData is required.
 * @param res      returns a sent message.
 */
const sendMessage = async (req, res) => {
    const { files, fields } = await getData(req)
    const { chat } = req.params

    if(!mongoose.Types.ObjectId.isValid(chat)) {
        return fail(res, "Bad request.")
    }

    if(!("content" in fields) && !files.length && !("forwardedMessage" in fields)) {
       return fail(res, "Bad request.")
    }
    
    try {
        let uploadedImages 
        if(files) {
            uploadedImages = await uploadImages(files)
        } else {
            uploadedImages = [{ public_id: "", url: "" }]
        }

        const messageData = {
            from: req.user._id,
            content: fields.content ? fields.content : "",
            chat, 
            images: uploadedImages,
            readBy: [req.user._id],
            replyToMessage: fields.replyMessage || null,
            forwardedMessage: fields.forwardedMessage || null
        }

        const newMessage = await Message.create(messageData)

        const populatedMessage = await Message.findOne({ _id: newMessage._id })
          .populate("from", "-password")
          .populate("chat")
          .populate("readBy", "-password")
          .populate("replyToMessage")
          .populate("forwardedMessage")
          .lean()
          .exec()

        const populatedMembers = await User.populate(populatedMessage, {
            path: "chat.members",
            select: "username profileImage"
        })

        const populatedReply = await User.populate(populatedMembers, {
            path: "replyToMessage.from",
            select: "username _id"
        })

        const message = await User.populate(populatedReply, {
            path: "forwardedMessage.from",
            select: "username _id profileImage firstName lastName email"
        })

        const updatedChat = await Chat.findByIdAndUpdate(chat, { lastMessage: message })
          .populate("lastMessage")

        success(res, message)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Mark the message as read.
 * @route          POST /api/message/read/:chatid
 * @param req      req.params.chatid is required.
 * @param res      returns an updated chat.
 */
const readMessage = async (req, res) => {

    const { chatid } = req.params

    if(!mongoose.Types.ObjectId.isValid(chatid)) {
        return fail(res, "Bad request.")
    }

    try {
        const chat = await Chat.findById(chatid)
            .populate("members", "-password")
            .populate("admin", "-password")
            .populate("lastMessage")

        if (!chat) {
            return fail(res, "Chat not found.", 404)
        }

        if(!chat.lastMessage) {
            return success(res, chat)
        }

        if(chat.lastMessage.readBy && !chat.lastMessage.readBy.includes(req.user._id)) {
            const message = await Message.findByIdAndUpdate(chat.lastMessage._id, {
                $push: {
                    readBy: req.user._id
                }
            }, { new: true })
            chat.lastMessage.readBy = [...chat.lastMessage.readBy, req.user._id]
        }
        const updated = await chat.save()

        success(res, updated)
 
    } catch (error) {
        console.log("\n\n\n\n\nerror:", error.message)
    }
}

/**
 * @description    Send a voice message.
 * @route          POST /api/message/voice/:chat
 * @param req      req.params.chat, req.file is required.
 * @param res      returns a sent voice message.
 */
const sendVoiceMessage = async (req, res) => {
    const { chat } = req.params

    if(!req.file) {
        return fail(res, "Oops!~ I see no voice message :(")
    }

    if(!chat || !mongoose.Types.ObjectId.isValid(chat)) {
        return fail(res, "Chat not found.", 404)
    }

    try {
        const voiceMessage = await uploadAudio(req.file.originalname, req.file.buffer)

        if(voiceMessage) {
            const messageData = {
                from: req.user._id,
                content: "",
                chat,
                voiceMessage
            }

            const newMessage = await Message.create(messageData)
            
            const populatedMessage = await Message.findOne({ _id: newMessage._id })
              .populate("from", "-password")
              .populate("chat")
              .lean()
              .exec()

            const message = await User.populate(populatedMessage, {
                path: "chat.members",
                select: "username profileImage"
            })

            await Chat.findByIdAndUpdate(chat, { lastMessage: message._id })

            success(res, message)
        }
    
    } catch (error) {
        fail(res, error.message)
    }
}



/**
 * @description    Delete a message.
 * @route          DELETE /api/message/:id
 * @param req      req.params.id is required.
 * @param res      returns a deleted message.
 */
const deleteMessage = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id) || !id) {
        return fail(res, "Bad request.", 400)
    }
    
    try {
        const message = await Message.findByIdAndDelete(id)

        if(!message) {
            return fail(res, "Message not found.", 404)
        }

        success(res, message)
    } catch (error) {
        fail(res, error.message)
    }
}


/**
 * @description    Update a message.
 * @route          PUT /api/message/update/:messageid
 * @param req      req.params.messageid, req.content are required.
 * @param res      returns an updated message.
 */
const updateMessage = async (req, res) => {
    const { messageid } = req.params
    const { content } = req.body

    if(!mongoose.Types.ObjectId.isValid(messageid)) {
        return fail(res, "Invalid Object ID.", 400)
    }

    try {
        const foundMessage = await Message.findOneAndUpdate({ _id: messageid }, {
            wasMessageUpdated: true,
            content
        }, { new: true })
          .populate("from", "-password")
          .populate("chat")
          .populate("readBy", "-password")
          .populate("replyToMessage")
          .lean()
          .exec()
        
        if(!foundMessage) {
            return fail(res, "Message not found.", 404)
        }

        const message = await User.populate(foundMessage, {
            path: "replyToMessage.from",
            select: "username _id"
        })

        success(res, message)

    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Like a message.
 * @route          PUT /api/message/like-message/:messageid
 * @param req      req.params.messageid is required.
 * @param res      returns an updated message.
 */
const likeMessage = async (req, res) => {
    const { messageid } = req.params

    if(!mongoose.Types.ObjectId.isValid(messageid)) {
        return fail(res, "Bad request.")
    }

    try {
        const foundMessage = await Message.findOneAndUpdate({ _id: messageid }, {
            $push: {
                likes: req.user._id
            }
        }, { new: true })
          .populate("from", "-password")
          .populate("chat")
          .populate("readBy", "-password")
          .populate("replyToMessage")
          .lean()
          .exec()

        if(!foundMessage) {
            return fail(res, "Message not found.", 404)
        }

        const message = await User.populate(foundMessage, {
            path: "replyToMessage.from",
            select: "username _id"
        })

        success(res, message)
    } catch (error) {
        fail(res, error.message)
    }
}

/**
 * @description    Unlike a message.
 * @route          PUT /api/message/unlike-message/:messageid
 * @param req      req.params.messageid is required.
 * @param res      returns an updated message.
 */
const unlikeMessage = async (req, res) => {
    const { messageid } = req.params

    if(!mongoose.Types.ObjectId.isValid(messageid)) {
        return fail(res, "Bad request.")
    }

    try {
        const foundMessage = await Message.findOneAndUpdate({ _id: messageid }, {
            $pull: {
                likes: req.user._id
            }
        }, { new: true })
          .populate("from", "-password")
          .populate("chat")
          .populate("readBy", "-password")
          .populate("replyToMessage")
          .lean()
          .exec()

        if(!foundMessage) {
            return fail(res, "Message not found.", 404)
        }

        const message = await User.populate(foundMessage, {
            path: "replyToMessage.from",
            select: "username _id"
        })

        success(res, message)
    } catch (error) {
        fail(res, error.message)
    }
}

module.exports = {
    getMessages,
    sendMessage,
    sendVoiceMessage,
    readMessage,
    deleteMessage,
    updateMessage,
    likeMessage,
    unlikeMessage
}