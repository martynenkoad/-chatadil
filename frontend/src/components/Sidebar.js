import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Searchbar from "./Searchbar"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getChat, getChats } from "../redux/chat/chatSlice"
import { selectChat } from "../redux/message/messageSlice"
import { removeMember, readMessage } from "../redux/chat/chatSlice"
import { useDispatch } from "react-redux"
import Loading from "../components/Loading"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import Profile from "./Profile"
import crocodile from "../assets/crocodile.png"
import SingleImageComponent from "./SingleImageComponent"
import { format } from "date-fns"

// new Date(message.time).toLocaleTimeString() !!!!

export default function Sidebar() {
    const user = useSelector(state => state.auth)

    const [isSelected, setIsSelected] = useState(null)
    const [openInfo, setOpenInfo] = useState(null)
    const [isImageOpened, setIsImageOpened] = useState(false)
    const [imageToOpen, SetImageToOpen] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { chats, foundChats, isLoading, isError, message } = useSelector((state) => state.chat)
    const { chat, isLoading: messageIsLoading, isError: messageIsError, message: messageMessage } = useSelector((state) => state.message)

    useEffect(() => {
        dispatch(getChats())
    }, [])

    useEffect(() => {
        if(chat._id) setIsSelected(chat._id)
    }, [chat])

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } 
        if(messageIsError) {
            toast.error(messageMessage)
        }
    }, [isError, messageIsError])

    const handleSelect = (room) => {
        setIsSelected(room._id)
        dispatch(selectChat(room))
        dispatch(readMessage(room._id))
        navigate(`/chat/${room._id}`)
    }

    const openChatInfo = (room) => {
        setOpenInfo(room)
    }

    const openImage = (imageUrl) => {
        setIsImageOpened(true)
        SetImageToOpen(imageUrl)
    }

    const leaveChat = async (userId) => {
        dispatch(removeMember({ chatId: openInfo._id, userId }))
          .then(() => {
            navigate("/chat")
            window.location.reload()
          })
    }

    
  const { chatid } = useParams()
  useEffect(() => {
    if(chatid && chatid !== undefined) {
        if(chat && chat._id) {
            return console.log("")
        } else {
            dispatch(getChat(chatid))
            .then(data => {
                // console.log("data:", data)
                handleSelect(data.payload)
            })
        }
        
    }
  }, [chatid, useParams])

    if(!user) { return <></> }

    if(openInfo) {
        return (
            <div className="sidebar">
                <div className="open-info-header">
                    <h3>{openInfo.chatName}</h3>
                    <span 
                      className="material-symbols-outlined close"
                      onClick={ () => setOpenInfo(null) }
                    >
                        close
                    </span>
                </div>

                <div className="open-info-main-section">
                    <img 
                      className={!openInfo.chatImage.url ? "preset-chat-image" : "chat-image"}
                      src={openInfo.chatImage.url ? openInfo.chatImage.url : crocodile}
                      alt=""
                      onClick={openInfo.chatImage.url ? () => openImage(openInfo.chatImage): () => console.log("")}
                    />

                    <span className="created-at">{ t("sidebarCreatedAt") } {format(new Date(openInfo.createdAt), "MM/dd/yyyy")}</span>

                    {
                        openInfo.isGroupChat &&
                        <div className="description">
                          <h4>{ t("sidebarDescription") }</h4>
                          <p>
                              {openInfo.description}
                          </p>
                        </div>
                    }
                </div>

                {
                    openInfo.isGroupChat &&
                    openInfo &&
                    <div className="admin">
                        <h4>{ t("sidebarAdmin") }</h4>
                        <div className="user-info">
                            <img 
                              className={openInfo.admin.profileImage.url ? "ava" : "preset-ava"}
                              src={openInfo.admin.profileImage.url ? openInfo.admin.profileImage.url : crocodile}
                              alt=""
                            />
                            <div className="user-info-text">
                                <span className="username">
                                    {openInfo.admin.username}
                                </span>
                                <span className="email">
                                    {openInfo.admin.email}
                                </span>
                            </div>
                        </div>
                    </div>
                }

                    <div className="members">
                    <h4>{ t("sidebarMembers") }</h4>
                    {
                        openInfo.members.map(member => {
                            if(member._id !== user.user._id) {
                            return (
                                <div className="user-info">
                                    <img 
                                        className={member.profileImage.url ? "ava" : "preset-ava"}
                                        src={member.profileImage.url ? member.profileImage.url : crocodile}
                                        alt=""
                                    />
                                    <div className="user-info-text">
                                        <span className="username">
                                            {member.username}
                                        </span>
                                        <span className="email">
                                            {member.email}
                                        </span>
                                    </div>
                                    {
                                        openInfo.isGroupChat && openInfo.admin &&
                                        openInfo.admin._id === user.user._id  && 
                                        <span 
                                          className="material-symbols-outlined remove-user"
                                          onClick={() => leaveChat(member._id)}
                                        >
                                            group_remove
                                        </span>
                                    }
                                </div>
                            )
                            }
                        })
                    }
                </div>

                <div className="leave-chat-btn-container"
                onClick={() => leaveChat(user.user._id)}
                >
                    <span className="leave-chat-btn" >
                        { t("sidebarLeaveChat") }
                    </span>
                </div>

                {
                    openInfo.admin && openInfo.admin._id === user.user._id && openInfo.isGroupChat &&
                    <Link to={`/edit-chat/${openInfo._id}`} className="leave-chat-btn-container">
                        <span className="edit-chat-btn">
                            { t("sidebarEditChat") }
                        </span>
                    </Link>
                }

            {
                isImageOpened && imageToOpen &&
                <SingleImageComponent 
                  image={imageToOpen}
                  setIsImageOpened={setIsImageOpened}
                />
            }
            </div>
        )
    }

    // chats.forEach(chat => {
    //     console.log("chat.areMessagesRead: ", chat.areMessagesRead)
    // })

    return (
        <div className="sidebar">
            <h3>{t("sidebarHeader")}</h3>
            <Searchbar />
            {
                chats && foundChats.length === 0 && user &&
                chats.map((room, index) => {
                    return (
                        <div
                          onClick={() => handleSelect(room)}
                          className={isSelected === room._id ? "selected-chat" : "chat"} 
                          key={index}
                        >
                            <span
                              className={!room.areMessagesRead ? "unread-chat" : ""}
                            >
                                {room.chatName}
                            </span>
                            <span  
                              className="material-symbols-outlined more"
                              onClick={() => openChatInfo(room) }
                            >
                                more_horiz
                            </span>
                        </div>
                    )
                })
            } {
                foundChats.length !== 0 &&
                foundChats.map((room, index) => {
                    return (
                        <div
                          onClick={() => handleSelect(room)}
                          className={isSelected === room._id ? "selected-chat" : "chat"}
                          key={index}
                        >
                            <span>{room.chatName}</span>
                            <span  
                              className="material-symbols-outlined more"
                              onClick={() => openChatInfo(room) }
                            >
                                more_horiz
                            </span>
                        </div>
                    )
                })
            }

            <div className="add-chat-section">
              <h5>{t("sidebarCreateChat")}</h5>
              <Link to="/add-chat"
                className="add-chat-btn"
              >+</Link>
            </div>
            {
                (isLoading || messageIsLoading)
                &&
                <Loading />
            }
            {
                openInfo &&
                <Profile 
                  room={openInfo}
                />                
            }
            
        </div>
    )
}