import { createContext } from "react"

const initState = {
    locale: "en",
    setLocale: () => {}
}

export default createContext(initState)