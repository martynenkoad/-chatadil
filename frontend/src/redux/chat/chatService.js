import makeCall from "../../api/transport"

const getChats = async () => {
    try {
        const data = await makeCall("/chat", "GET")
        return data
    } catch (error) { throw Error(error) }
}

const getChat = async (chatid) => {
    try {
        const data = await makeCall(`/chat/${chatid}`, "GET")
        return data
    } catch (error) { throw Error(error) }
}

const createChat = async (chatData) => {
    try {
        const data = await makeCall("/chat", "POST", chatData)
        return data
    } catch (error) { throw Error(error) }
}

const createGroupChat = async (chatData) => {
    try {
        const data = await makeCall("/chat/group-chat", "POST", chatData)
        return data
    } catch (error) { throw Error(error) }
}

const deleteChat = async (chatid) => {
    try {
        const data = await makeCall(`/chat/${chatid}`, "DELETE")
        return data
    } catch (error) { throw Error(error) }
}

const updateChat = async (chatData) => {
    try {
        const data = await makeCall("/chat", "PUT", chatData)
        return data
    } catch (error) { throw Error(error) }
}

const readMessages = async (chatid) => {
    try {
        const data = await makeCall(`/message/read/${chatid}`, "PUT")
        return data
    } catch (error) { throw Error(error) }
}

const addMember = async (chatData) => {
    try {
        const data = await makeCall("/chat/add-member", "PUT", chatData)
        return data
    } catch (error) { throw Error(error) }
}

const removeMember = async (chatId, userId) => {
    try {
        const data = await makeCall("/chat/remove-member", "PUT", { chatId, userId })
        return data
    } catch (error) { throw Error(error) }
}

const chatService = {
    getChats,
    getChat,
    createChat,
    createGroupChat,
    deleteChat,
    updateChat,
    readMessages,
    addMember,
    removeMember
}

export default chatService 