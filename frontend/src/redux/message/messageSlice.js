import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import messageService from "./messageService"

const initialState = {
    chat: {}, 
    prevChat: {},
    maxPages: 1,
    messages: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
}

export const getMessages = createAsyncThunk("message/getMessages", async ({ socket, chatid, page, limit }, { rejectWithValue }) => {
    try {
        return await messageService.getMessages(socket, chatid, page, limit)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const sendMessage = createAsyncThunk("message/sendMessage", async ({ socket, chat, fd }, { rejectWithValue }) => {
    try { 
        return await messageService.sendMessage(socket, chat, fd)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const sendVoiceMessage = createAsyncThunk("message/sendVoiceMessage", async ({ socket, chat, fd }, {rejectWithValue}) => {
  try {
    return await messageService.sendVoiceMessage(socket, chat, fd)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const deleteMessage = createAsyncThunk("message/deleteMessage", async ({ socket, item }, { rejectWithValue }) => {
  try {
    return await messageService.deleteMessage(socket, item)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const updateMessage = createAsyncThunk("message/updateMessage", async ({ socket, message, content }, { rejectWithValue }) => {
  try {
    return await messageService.updateMessage(socket, message, content) 
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const likeMessage = createAsyncThunk("message/likeMessage", async ({ socket, message }, { rejectWithValue }) => {
  try {
    return await messageService.likeMessage(socket, message)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const unlikeMessage = createAsyncThunk("message/unlikeMessage", async ({ socket, message }, { rejectWithValue }) => {
  try {
    return await messageService.unlikeMessage(socket, message)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        },
        selectChat: (state, action) => {
          state.prevChat = state.chat
          state.chat = action.payload
        },
        sendMessages: (state, action) => {
          state.messages = [...state.messages, action.payload]
        },
        deleteMessages: (state, action) => {
          state.messages = state.messages.filter(msg => msg._id !== action.payload._id)
        },
        updateMessages: (state, action) => {
          let newMessages = []
            state.messages.forEach(msg => {
              if (msg._id === action.payload._id) {
                newMessages.push(action.payload)
              } else {
                newMessages.push(msg)
              }
            })
            state.messages = newMessages
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getMessages.pending, (state) => {
            state.isLoading = true
          })
          .addCase(getMessages.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.messages = action.meta.arg.page > 1 ? action.payload.messages.concat(state.messages) : action.payload.messages
            state.maxPages = action.payload.totalPages
          }) 
          .addCase(getMessages.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(sendMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(sendMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.messages = [...state.messages, action.payload]
          })
          .addCase(sendMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(sendVoiceMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(sendVoiceMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.messages = [...state.messages, action.payload]
          })
          .addCase(sendVoiceMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(deleteMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(deleteMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.messages = state.messages.filter(msg => msg._id !== action.payload._id)
          }) 
          .addCase(deleteMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })    
          
          .addCase(updateMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(updateMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            let newMessages = []
            state.messages.forEach(msg => {
              if (msg._id === action.payload._id) {
                newMessages.push(action.payload)
              } else {
                newMessages.push(msg)
              }
            })
            state.messages = newMessages
          })
          .addCase(updateMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(likeMessage.pending, (state) => {
            state.isLoading = true
          })
          .addCase(likeMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            let newMessages = []
            state.messages.forEach(msg => {
              if (msg._id === action.payload._id) {
                newMessages.push(action.payload)
              } else {
                newMessages.push(msg)
              }
            })
            state.messages = newMessages
          })
          .addCase(likeMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(unlikeMessage.pending, (state) => {
            state.isLoading = true
          }) 
          .addCase(unlikeMessage.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            let newMessages = []
            state.messages.forEach(msg => {
              if (msg._id === action.payload._id) {
                newMessages.push(action.payload)
              } else {
                newMessages.push(msg)
              }
            })
            state.messages = newMessages
          })
          .addCase(unlikeMessage.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })
    }
})

export const { reset, selectChat, sendMessages, deleteMessages, updateMessages } = messageSlice.actions
export default messageSlice.reducer 