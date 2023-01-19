import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const user = JSON.parse(localStorage.getItem("user"))
 
const initialState = {
    user: user ? user : null,
    users: [], 
    foundUsers: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
} 

/**
 * Sign up the user.
 */
export const signup = createAsyncThunk("user/signup", async (user, { rejectWithValue }) => {
    try {
        return await authService.signup(user)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})


/**
 * Log in the user.
 */
export const login = createAsyncThunk("user/login", async (user, { rejectWithValue }) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = error.message || error.toString()
        return rejectWithValue(message)
    }
})

export const getUsers = createAsyncThunk("user/getUsers", async (none, { rejectWithValue }) => {
  try {
    return await authService.getUsers()
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const editProfile = createAsyncThunk("user/editProfile", async ({ firstName, lastName, username, profileImage }, { rejectWithValue }) => {
  try {
    return await authService.editProfile({ firstName, lastName, username, profileImage })
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (item, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(item)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const resetPassword = createAsyncThunk("user/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(token, password)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const sendQuestion = createAsyncThunk("user/sendQuestion", async ({ email, name, question }, { rejectWithValue }) => {
  try {
    return await authService.sendQuestion(email, name, question)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

export const findUser = createAsyncThunk("user/findUser", async ({ search, chatid }, { rejectWithValue }) => {
  try {
    return await authService.findUser(search, chatid)
  } catch (error) {
    const message = error.message || error.toString()
    return rejectWithValue(message)
  }
})

/**
 * Log out the user.
 */
export const logout = createAsyncThunk("user/logout", async () => {
    authService.logout()
})

export const authSlice = createSlice({
    name: "auth", 
    initialState, 
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder 
          .addCase(signup.pending, (state) => {
            state.isLoading = true
          })
          .addCase(signup.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
          })
          .addCase(signup.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
          })
          
          .addCase(login.pending, (state) => {
            state.isLoading = true
          })
          .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
          })
          .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
          })
          
          .addCase(logout.fulfilled, (state) => {
            state.user = null
          })
          .addCase(getUsers.pending, (state) => {
            state.isLoading = true
          })
          .addCase(getUsers.fulfilled, (state, action) => {
            state.isError = false
            state.isSuccess = true
            state.isLoading = false
            state.users = action.payload
          })
          .addCase(getUsers.rejected, (state, action) => {
            state.isSuccess = false
            state.isError = true
            state.isLoading = false
            state.message = action.payload
          })
          .addCase(editProfile.pending, (state) => {
            state.isLoading = true
          })     
          .addCase(editProfile.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
          })
          .addCase(editProfile.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
          })
          .addCase(forgotPassword.pending, (state) => {
            state.isLoading = true
          })
          .addCase(forgotPassword.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
          })
          .addCase(forgotPassword.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })
          .addCase(resetPassword.pending, (state) => {
            state.isLoading = true
          })
          .addCase(resetPassword.fulfilled, (state) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.message = "Your password is successfully reset!"
          })
          .addCase(resetPassword.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })
          .addCase(sendQuestion.pending, (state) => {
            state.isLoading = true
          })
          .addCase(sendQuestion.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
          })
          .addCase(sendQuestion.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
          })

          .addCase(findUser.pending, (state) => {
            state.isLoading = true
          })
          .addCase(findUser.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.foundUsers = action.payload
          })
          .addCase(findUser.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.foundUsers = []
            state.message = action.payload
          })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer