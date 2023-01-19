import makeCall from "../../api/transport"

const getMessages = async (socket, chatid, page, limit) => {
    try {
        const data = await makeCall(`/message?chat=${chatid}&limit=${limit}&page=${page}`, "GET")
        socket.emit("join_room", chatid)
        return data
    } catch (error) {
        throw Error(error)
    }
} 

const sendMessage = async (socket, chat, fd) => {
    try {
        const data = await makeCall(`/message/${chat}`, "POST", fd)
        socket.emit("new_message", data)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const sendVoiceMessage = async (socket, chat, fd) => {
    try {
        const data = await makeCall(`/message/voice/${chat}`, "POST", fd)
        socket.emit("new_message", data)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const deleteMessage = async (socket, message) => {
    try {
        const data = await makeCall(`/message/${message._id}`, "DELETE")
        socket.emit("delete_message", message)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const updateMessage = async (socket, message, content) => {
    try {
        const data = await makeCall(`/message/update/${message._id}`, "PUT", { content })
        socket.emit("update_message", message, content)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const likeMessage = async (socket, message) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        const data = await makeCall(`/message/like-message/${message._id}`, "PUT")
        socket.emit("like_message", message, user._id)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const unlikeMessage = async (socket, message) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        const data = await makeCall(`/message/unlike-message/${message._id}`, "PUT")
        socket.emit("unlike_message", message, user._id)
        return data
    } catch (error) {
        throw Error(error)
    }
}

const messageService = {
    getMessages,
    sendMessage,
    sendVoiceMessage,
    deleteMessage,
    updateMessage,
    likeMessage,
    unlikeMessage
}

export default messageService
 