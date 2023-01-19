const mongoose = require("mongoose")
const imageSchema = require("./imageSchema")
const voiceMessageSchema = require("./voiceMessageSchema")

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    readBy: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    images: [{
        type: imageSchema,
        default: {
            public_id: "",
            url: ""
        }
    }],
    voiceMessage: {
        type: voiceMessageSchema,
        default: {
            public_id: "",
            url: "",
            duration: 0
        }
    },
    replyToMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Message"
    },
    forwardedMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Message"
    },
    wasMessageUpdated: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema) 