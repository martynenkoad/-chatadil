const list = require("../utils/usernames")

/**
 * @description        Test a string to consist only of letters.
 * @param string   
 * @returns {Boolean}
 */
const isLetters = (string) => /^[a-zA-Z\u0400-\u04FF]+$/.test(string)

/**
 * @description        Remove all the spaces from a string.
 * @param string      
 * @returns {String}   A string with removed spaces.
 */
const replaceSpaces = (string) => string.replace(/\s+/g, '')

/**
 * @description        Test a string to be a username.
 * @param string      
 * @returns {Boolean}
 */
const isUsername = (string) => /^[a-zA-Z0-9]+$/.test(string)

/**
 * @description        Generate a funny username.
 * @returns {String}   A new random username.
 */
const generateRandomUsername = () => {
    let noun = Math.floor(Math.random() * list.nouns.length)
    let adjective = Math.floor(Math.random() * list.adjectives.length)
    let randomNumber = Math.floor(Math.random() * 100)

    const username = `${list.adjectives[adjective]}${list.nouns[noun]}${randomNumber}`
    return username
}

/**
 * @description        Generate a random password.
 * @returns {String}   A new random password.  
 */
const generatePassword = () => {
    return `CC${Math.random().toString(36)}!` 
}

module.exports = {
    isLetters,
    replaceSpaces,
    isUsername,
    generateRandomUsername,
    generatePassword
}