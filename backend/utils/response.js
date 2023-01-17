/**
 * @description    Return data as a successful response.
 * @param res      required.
 * @param data     optional; default: {}.
 * @param code     optional: a code of response; default: 200.
 */
const success = (res, data = {}, code = 200) => {
    return res.status(code).json(data)
}

/**
 * @description      Return data as a unsuccessful response.
 * @param res        required.
 * @param message    required.
 * @param code       optional: a code of response; default: 400.
 */
const fail = (res, message, code = 400) => {
    return res.status(code).json({ error: message })
}

module.exports = {
    success, 
    fail
}