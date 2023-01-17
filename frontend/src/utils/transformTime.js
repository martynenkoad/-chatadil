export const timeFunctions = {
    transformTime: (time) => {
        return time < 10 ? `0${time}` : `${time}`
    },

    transformSeconds: (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const clearSeconds = minutes > 0 ? Math.floor(seconds - (60 * minutes)) : Math.floor(seconds)
        return `0${minutes}:${clearSeconds > 10 ? `${clearSeconds}` : `0${clearSeconds}`}`
    }
}