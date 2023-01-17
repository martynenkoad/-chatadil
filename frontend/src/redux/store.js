import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import chatReducer from "./chat/chatSlice"
import messageReducer from "./message/messageSlice"

// Configure store with all reducers.
export default configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        message: messageReducer,
    }
})