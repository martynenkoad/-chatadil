import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { findUser } from "../redux/auth/authSlice"
import crocodile from "../assets/crocodile.png"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

export default function UserSearchbar({ chatid, members, handleSelect }) {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const user = JSON.parse(localStorage.getItem("user"))

    const [input, setInput] = useState("")

    const { foundUsers } = useSelector((state) => state.auth)

    const handleChange = async (e) => {
        setInput(e.target.value)

        if(!input || !user.token) return

        try {
            setTimeout(() => {
                dispatch(findUser({ search: input, chatid  }))
            }, 1000)
        } catch (error) {
            toast.error(error.message || error.toString())
        }
    }

    return (
        <div className="edit-chat-members">
            <h4>{ t("addNewMembers") }</h4>
            <div className="searchbar">
                <input 
                  type="text"
                  placeholder={ t("searchUsers") }
                  value={input}
                  onChange={(e) => handleChange(e)}
                />
                <span className="material-symbols-outlined sym">
                    search
                </span>
            </div>

            {
                foundUsers &&
                foundUsers.map((singleUser, index) => {
                    return (
                        <div className="single-member" key={index}>
                            <div className="left-section">
                                <img 
                                  className={singleUser.profileImage.url ? "ava" : "preset-ava"}
                                  src={singleUser.profileImage.url ? singleUser.profileImage.url : crocodile}
                                  alt=""
                                />
                                <div className="single-member-info">
                                    <span className="username">{singleUser.username}</span>
                                    <span className="email">{singleUser.email}</span>
                                </div>
                            </div> 

                            <span 
                                className="material-symbols-outlined delete-user-btn"
                                onClick={() => handleSelect(singleUser)}
                            >
                                {members.includes(singleUser) ? "person_remove" : "person_add"}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )
}