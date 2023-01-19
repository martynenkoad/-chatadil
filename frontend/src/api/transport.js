import defaultSettings from "./defaultSettings"

/**
 * Check if the type of data is FormData.
 * @param data 
 * @returns {boolean} 
 */
const isFormData = (data) => {
    return typeof data === "object" && data instanceof FormData
} 

/**
 * Call to the backend with the provided parametres.
 * @param url 
 * @param method 
 * @param items 
 * @param isAuth 
 * @param token 
 * @returns {object}
 */
const makeCall = async (url, method, items, isAuth = true, token = "") => {
    const _method = method ? method : "GET"
    const user = JSON.parse(localStorage.getItem("user"))

    const headers = isAuth ? { "Authorization": `Bearer ${token ? token : user.token}` } : {}

    const contentType = isFormData(items) ? "multipart/form-data" : "application/json"

    if(!isFormData(items)) {
        headers["Content-Type"] = contentType
    }

    const body = isFormData(items) ? items : JSON.stringify(items)
    
    const params = items ? {
        method: _method,
        headers,
        body
    } : {
        method,
        headers
    }

    const response = await fetch(`${defaultSettings.baseUrl}${url}`, params)
    const json = await response.json()

    if(response.ok) {
        return json
    } else {
        throw Error(json.error)
    }
}

export default makeCall