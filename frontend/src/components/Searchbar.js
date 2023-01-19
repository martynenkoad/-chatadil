import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { searchChat } from "../redux/chat/chatSlice"
import { useTranslation } from "react-i18next"

export default function Searchbar() {
    const [input, setInput] = useState("")

    const dispatch = useDispatch()
    const { t } = useTranslation()

    const handleChange = (e) => {
        const { value } = e.target
        const search = value.toLowerCase().trim()

        setInput(value)
        dispatch(searchChat(search))
    }
 
    return (
        <div className="searchbar">
            <input 
              type="text"
              placeholder={ t("findChat") }
              value={input}
              onChange={handleChange}
            />
            <span className="material-symbols-outlined sym">
                search
            </span>
        </div>
    )
} 