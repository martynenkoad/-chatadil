const mongoose = require("mongoose")

const Schema = mongoose.Schema

const imageSchema = new Schema({
    public_id: { type: String },
    url: { type: String }
})

module.exports = imageSchema