import React, { useEffect } from "react"
import crocodile from "../assets/crocodile.png"
import { useSelector, useDispatch } from "react-redux"
import { createChat, getChats } from "../redux/chat/chatSlice"
import { useNavigate } from "react-router-dom"

export default function SingleUser({ item, isGroupChatComp, rightItem }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const startChat = async () => {
        dispatch(getChats())
        dispatch(createChat({ userId: item._id }))
        navigate(`/chat`)
    }

    useEffect(() => {
        dispatch(getChats())
    }, [])

    return (
        <>
            <div 
              onClick={!isGroupChatComp ? startChat : () => console.log("")}
            >
               <img 
                    className={item.profileImage.url ? "" : "preload-image"}
                    src={item.profileImage.url ? item.profileImage.url : crocodile} 
                    alt="" 
                />
               <div className="text">
                  <span className="username">{item.username}</span>
                  <span className="email">{item.email}</span>
               </div>
               
            </div>
            { 
                rightItem &&
                <span className="material-symbols-outlined">
                    {rightItem}
                </span>
            }
        </>
    )
}