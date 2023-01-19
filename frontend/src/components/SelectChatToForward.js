import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import crocodile from "../assets/crocodile.png"
import { readMessage } from "../redux/chat/chatSlice"
import { selectChat } from "../redux/message/messageSlice"
import { useTranslation } from "react-i18next"

export default function SelectChatToForward({ forwardMessage, setForwardMessage, setShowSelectChatToForward, setReplyMessage }) {
    const { chats } = useSelector((state) => state.chat)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const handleCloseForwarding = () => {
        setForwardMessage(null)
        setShowSelectChatToForward(false)
    }

    const handleForwardMessage = (chat) => {
        setShowSelectChatToForward(false)
        dispatch(selectChat(chat))
        dispatch(readMessage(chat._id))
        navigate(`/chat/${chat._id}`)
    }

    return (
        <div className="select-chat-to-forward">
            <div className="header">
                <h3>{t("selectChatToForward")}</h3>
                <span 
                  className="material-symbols-outlined"
                  onClick={handleCloseForwarding}
                >
                    close
                </span>
            </div>

            {
                chats && chats.length &&
                <div className="chats-section">

                    {
                        chats.map(singleChat => {
                           return (
                              <div className="single-chat" onClick={() => handleForwardMessage(singleChat)}>
                                <img 
                                  className={singleChat.chatImage.url ? "ava" : "preset-ava"}
                                  src={singleChat.chatImage.url || crocodile}
                                  alt=""
                                />
                                <h4>{singleChat.chatName}</h4>
                              </div>
                           )
                        })
                    }
                </div>
            }
        </div>
    )
} 