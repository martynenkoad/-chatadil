import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteMessage } from "../redux/message/messageSlice"

export default function Menu({ item, coords, socket, setReplyMessage, setContentToEdit, likeMsg, unlikeMsg, setForwardMessage, setShowSelectChatToForward }) {
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)

    const deleteMsg = async (item) => {
        dispatch(deleteMessage({ socket, item }))
    }

    const openUpdateMessage = (item) => {
        setContentToEdit(item)
    }

    const handleReply = (item) => {
        setForwardMessage(null)
        setReplyMessage(item)
    }

    const handleForward = (item) => {
        setReplyMessage(null)
        setForwardMessage(item)
        setShowSelectChatToForward(true)
    }

    return (
        <div className="menu-context" style={{
            top: `${document.documentElement.scrollHeight - coords.y < 300 ? document.documentElement.scrollHeight - 300 : coords.y}px`,
            left: `70vw`
        }}>
            <p className="option" onClick={() => handleReply(item)}>
                <span className="material-symbols-outlined">
                    reply
                </span>
                Reply
            </p>
            <p className="option" onClick={() => handleForward(item)}>
                <span  
                  className="material-symbols-outlined"
                >
                    forward
                </span>
                Forward
            </p>
            {
                item.likes &&
                <p 
                  className="option"
                  onClick={item.likes.includes(user._id) ? () => unlikeMsg(item) : () => likeMsg(item)}
                >
                  <span className="material-symbols-outlined">
                      favorite
                  </span>
                  {item.likes.includes(user._id) ? "Unlike" : "Like"}
                </p>
            }
            {
                item.from._id === user._id &&
                <p className="option update" onClick={() => openUpdateMessage(item)}>
                    <span className="material-symbols-outlined">
                        edit
                    </span>
                    Update
                </p>
            } {
                item.from._id === user._id &&
                <p className="option delete" onClick={() => deleteMsg(item)}>
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                    Delete
                </p>
            }
        </div>
    )
}