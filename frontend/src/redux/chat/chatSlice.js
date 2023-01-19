import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import chatService from "./chatService"

const initialState = {
    chats: [],
    currentChat: "",
    foundChatToEdit: null,
    foundChats: [],
    isSearchActive: false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const getChats = createAsyncThunk("chat/getChats", async (thunkApi) => {
    try {
        return await chatService.getChats()
    } catch (error) {
        const message = error.message || error.toString()
        return thunkApi.rejectWithValue(message)
    }
})

export const getChat = createAsyncThunk("chat/getChat", async (chatid, { rejectWithValue }) => {
  try {
    return await chatService.getChat(chatid)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const createChat = createAsyncThunk("chat/createChat", async (chatData, { rejectWithValue }) => {
    try {
        return await chatService.createChat(chatData)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const createGroupChat = createAsyncThunk("chat/createGroupChat", async (chatData, { rejectWithValue }) => {
    try {
        return await chatService.createGroupChat(chatData)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const deleteChat = createAsyncThunk("chat/deleteChat", async (chatid, {rejectWithValue}) => {
    try {
        return await chatService.deleteChat(chatid)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const updateChat = createAsyncThunk("chat/updateChat", async (chatData, { rejectWithValue }) => {
    try {
        return await chatService.updateChat(chatData)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const readMessage = createAsyncThunk("chat/readMessage", async (chatid, { rejectWithValue }) => {
  try {
    return await chatService.readMessages(chatid)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const addMember = createAsyncThunk("chat/addMember", async (chatData, { rejectWithValue }) => {
    try {
        return await chatService.addMember(chatData)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const removeMember = createAsyncThunk("chat/removeMember", async ({ chatId, userId }, { rejectWithValue }) => {
    try {
        return await chatService.removeMember(chatId, userId)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        reset: (state) => {
            state.foundChats = []
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ""
            state.isChatSelected = false
        },
        searchChat: (state, action) => {
            const found = state.chats.filter(item => {
                return (
                  item.chatName.toLowerCase().search(action.payload.toLowerCase()) !== -1
                )
              })
    
              state.isSearchActive = !!action.payload.length > 0 || false
              state.foundChats = found
        },
        markMessageAsUnread: (state, action) => {
          let newChats = []
          state.chats.forEach(singleChat => {
            if (singleChat._id === action.payload._id) {
              singleChat["areMessagesRead"] = false
              newChats.push(singleChat)
            } else {
              newChats.push(singleChat)
            }

          })

          state.chats = newChats
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getChats.pending, (state) => {
            state.isLoading = true
          })
          .addCase(getChats.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            const user = JSON.parse(localStorage.getItem("user"))
            let newChats = []

            action.payload.forEach(singleChat => {
              singleChat["areMessagesRead"] = singleChat.lastMessage ? singleChat.lastMessage.readBy.includes(user._id) : true
              newChats.push(singleChat)
            })
            
            state.chats = action.payload
          })
          .addCase(getChats.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.chats = []
          })
          .addCase(getChat.pending, (state) => {
            state.isLoading = true
          })
          .addCase(getChat.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.foundChatToEdit = action.payload
          })
          .addCase(getChat.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.foundChatToEdit = null
          })
          .addCase(createChat.pending, (state) => {
            state.isLoading = true
          })
          .addCase(createChat.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.currentChat = action.payload
            state.chats = [action.payload, ...state.chats]
          })
          .addCase(createChat.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.chats = []
          })
          .addCase(createGroupChat.pending, (state) => {
            state.isLoading = true
          })
          .addCase(createGroupChat.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.chats = [action.payload, ...state.chats]
          })
          .addCase(createGroupChat.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.chats = []
          })

          .addCase(deleteChat.pending, (state) => {
            state.isLoading = true
          })
          .addCase(deleteChat.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.chats = state.chats.filter(chat => chat._id !== action.payload._id)
          })
          .addCase(deleteChat.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(updateChat.pending, (state) => {
            state.isLoading = true
          })
          .addCase(updateChat.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.chats = state.chats.filter(chat => chat._id === action.payload._id ? action.payload : chat)
          })
          .addCase(updateChat.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(readMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(readMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true

            state.chats.forEach(chat => {
              if (chat._id === action.payload._id) {
                chat.areMessagesRead = true
              }
            })
          })
          .addCase(readMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(addMember.pending, (state) => {
            state.isLoading = true
          })
          .addCase(addMember.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.chats = state.chats.filter(chat => chat._id === action.payload._id ? action.payload : chat)
          })
          .addCase(addMember.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(removeMember.pending, (state) => {
            state.isLoading = true
          })
          .addCase(removeMember.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.chats = state.chats.filter(chat => chat._id === action.payload._id ? action.payload : chat)
          })
          .addCase(removeMember.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })
    }
})

export const { reset, searchChat, readMessages, markMessageAsUnread } = chatSlice.actions
export default chatSlice.reducer 