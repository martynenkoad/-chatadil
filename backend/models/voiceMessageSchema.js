const mongoose = require("mongoose")

const Schema = mongoose.Schema

const voiceMessageSchema = new Schema({
    public_id: { type: String },
    url: { type: String },
    duration: { type: Number }
})

module.exports = voiceMessageSchema