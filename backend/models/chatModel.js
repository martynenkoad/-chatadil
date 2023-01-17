const mongoose = require("mongoose")
const imageSchema = require("./imageSchema")

const Schema = mongoose.Schema

const chatSchema = new Schema({
    chatName: {
        type: String,
        required: true
    },
    chatImage: {
        type: imageSchema,
        default: {
            public_id: "",
            url: ""
        }
    },
    description: {
        type: String,
        default: ""
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Message"
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    isChannel: {
        type: Boolean, 
        default: false
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

module.exports = mongoose.model("Chat", chatSchema)