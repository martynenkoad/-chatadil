import makeCall from "../../api/transport"

/**
 * Sign up the user.
 * @param user 
 */
const signup = async (user) => {
    try {
        const data = await makeCall("/user/signup", "POST", user, false)
        localStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) { throw Error(error) }
} 

const signupViaGoogle = async (googleAccessToken) => {
    try {
        const data = await makeCall("/user/signup", "POST", googleAccessToken, true, googleAccessToken) 
        localStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) { throw Error(error) }
}

/**
 * Log in the user.
 * @param user 
 */
const login = async (user) => {
    try {
        const data = await makeCall("/user/login", "POST", user, false)
        localStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) { throw Error(error) }    
} 

const loginViaGoogle = async (googleAccessToken) => {
    try {
        const data = await makeCall("/user/login", "POST", googleAccessToken, false)
        localStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) { throw Error(error) }
} 

/**
 * Log out the user.
 */
const logout = () => {
    localStorage.removeItem("user")
} 

const getUsers = async () => {
    try {
        const data = await makeCall("/user", "GET")
        return data
    } catch (error) { throw Error(error) }
}

const editProfile = async ({ firstName, lastName, username, profileImage }) => {
    try {
        const data = await makeCall("/user/edit-profile", "PUT", { firstName, lastName, username, profileImage })
        localStorage.setItem("user", JSON.stringify(data))
        return data
    } catch (error) { throw Error(error) }
}

const forgotPassword = async (item) => {
    try {
        const data = await makeCall("/user/forgot-password", "POST", item, false)
        return data
    } catch (error) { throw Error(error) }
}

const resetPassword = async (password) => {
    try {
        const data = await makeCall("/user/reset-password", "POST", { password })
        return data
    } catch (error) { throw Error(error) }
}

const sendQuestion = async (email, name, question) => {
    try {
        const data = await makeCall("/user/send-question", "POST", { email, name, question })
        return data
    } catch (error) { throw Error(error) }
}

const findUser = async (search, chatid) => {
    try {
        const data = await makeCall(`/user/find-user?search=${search}&chatid=${chatid}`, "GET")
        return data
    } catch (error) { throw Error(error) }
}

const authService = {
    signup,
    signupViaGoogle,
    login,
    loginViaGoogle,
    logout,
    getUsers,
    editProfile,
    forgotPassword,
    resetPassword,
    sendQuestion,
    findUser
}

export default authService