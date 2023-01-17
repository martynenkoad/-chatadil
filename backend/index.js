require("dotenv").config()
const express = require("express")
const cors = require("cors")

const http = require("http")
const { Server } = require("socket.io")

const initMongo = require("./utils/initMongo")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express()

app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: true, limit: "100mb" }))
app.use(
    cors({
        origin: "*",
    })
)

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


const server = http.createServer(app)

const io = new Server(server, {
    pingTimeout: 44444,
    cors: {
        origin: process.env.FRONTEND_URL,
        // "Access-Control-Allow-Origin": "*",
        methods: ["GET", "POST", "DELETE", "PUT"],
        // credentials: true
    }
})

io.on("connection", (socket) => {

    console.log("\n\nConnected to the socket.")

    socket.on("setup", (user) => {
        socket.join(user)
        socket.emit("connection_available")
    })

    socket.on("join_room", (room) => {
        socket.join(room)
    })

    socket.on("leave_room", (room) => {
        socket.leave(room)
    })

    socket.on("typing", (room, userid) => {
        socket.to(room).emit("typing_to_client", userid)
    })

    socket.on("stop_typing", (room, userid) => {
        socket.to(room).emit("not_typing_to_client", userid)
    })


    socket.on("new_message", (receivedMessage) => {
        let chat = receivedMessage.chat

        chat.members.filter(member => member._id !== receivedMessage.from._id)

        socket.broadcast.emit("message_received", receivedMessage)
    })

    socket.on("delete_message", (messageToDelete) => {
        let chat = messageToDelete.chat

        socket.to(chat._id).emit("message_deleted", messageToDelete)
    })

    socket.on("update_message", (messageToUpdate, content) => {
        let chat = messageToUpdate.chat
        let newMessage = {...messageToUpdate, content}

        socket.to(chat._id).emit("message_updated", newMessage)
    })

    socket.on("like_message", (messageToLike, userid) => {
        let chat = messageToLike.chat

        messageToLike.likes.push(userid)
        socket.to(chat._id).emit("message_liked", messageToLike)
    })

    socket.on("unlike_message", (messageToUnlike, userid) => {
        let chat = messageToUnlike.chat

        messageToUnlike.likes.splice(messageToUnlike.likes.indexOf(messageToUnlike), 1)
        socket.to(chat._id).emit("message_unliked", messageToUnlike)
    })

    socket.on("connection_error", (error) => {
        console.log(`\n\nThe connection error occured: ${error}.\n\n`)
    })

    socket.on("disconnect", (reason) => {
        console.log(`\n\nThe reason for disconnection is: ${reason}.\n\n`)
    })
})

const runServer = () => {
    const port = process.env.PORT || 4004
    server.listen(port, () => {
        console.log(`\n\nServer is running on port ${port}... ;)\n\n`)
    })
}

// MAYBE SERVER NOT APP
initMongo(app, runServer)