import React, { useState, useEffect, useCallback, useRef } from "react"
import { io } from "socket.io-client"
import { sendMessages, getMessages, deleteMessages, updateMessages, likeMessage, unlikeMessage } from "../redux/message/messageSlice"
import { useSelector, useDispatch } from "react-redux"
import sheldon from "../assets/sheldon.png"
import defaultSettings from "../api/defaultSettings"
import { useTranslation } from "react-i18next"
import MessageInput from "./MessageInput"
import SingleImageComponent from "./SingleImageComponent"
import Profile from "../components/Profile" 
import VoiceMessagePlayer from "./VoiceMessagePlayer"
import { formatDistance, subDays } from "date-fns"
import IsTyping from "./IsTyping"
import Menu from "./Menu"
import detectLinks from "../utils/stringRoutines"
import { addMember, markMessageAsUnread } from "../redux/chat/chatSlice"
import { useNavigate, useParams } from "react-router-dom"
import SelectChatToForward from "./SelectChatToForward"

// A variable for the socket
let socket
const LIMIT_OF_MESSAGES = 50

export default function Message({ showSidebar, setShowSidebar }) {
  
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const messageRefs = useRef([])

    // States to handle all the processes of sending messages
    const [isSocketConnected, setIsSocketConnected] = useState(null)
    const [isTyping, setIsTyping] = useState(false)
    
    // Context: user, messages, chat.
    const { chatid } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { chats } = useSelector((state) => state.chat)
    const { messages, chat, maxPages, prevChat } = useSelector((state) => state.message)

    const [isImageOpened, setIsImageOpened] = useState(false)
    const [imageToOpen, setImageToOpen] = useState(null)
    const [showProfile, setShowProfile] = useState(null)
    const [showBottomButton, setShowBottomButton] = useState(false)
    const [pageOfMessages, setPageOfMessages] = useState(1)
    const [previousScrollHeight, setPreviousScrollHeight] = useState(document.documentElement.scrollHeight)
    const [openContextMenu, setOpenContextMenu] = useState(false)
    const [coords, setCoords] = useState({
      x: 0,
      y: 0
    })

    const [contentToEdit, setContentToEdit] = useState(null)
    const [replyMessage, setReplyMessage] = useState(null)
    const [forwardMessage, setForwardMessage] = useState(null)
    const [showSelectChatToForward, setShowSelectChatToForward] = useState(false)

    const scrollToTheBottom = (scrollHeight, behavior) => {
      setShowBottomButton(false)
      window.scrollTo({
        top:  scrollHeight,
        behavior
      })
    }

    const connectToSocket = () => {
      if (user) {
        socket = io(defaultSettings.endpoint) // initialize the socket
        socket.emit("setup", { userId: user._id, socketId: socket.id })

        socket.on("connection_available", () => {
          setIsSocketConnected(true)
        })

        socket.on("typing_to_client", (username) => setIsTyping(username))
        socket.on("not_typing_to_client", () => setIsTyping(false))

        socket.on("connect_error", (error) => {
          console.log(`The connection error occured: ${error}.`)
        })
      }
    }

    const handleSendMessages = () => {
          
      socket.on("message_received", (newMessage) => {

        if(!chat || chat._id !== newMessage.chat._id || chatid !== newMessage.chat._id) {
            dispatch(markMessageAsUnread(newMessage.chat))
        } else {
          dispatch(sendMessages(newMessage))
        }
          
      })
    }



  useEffect(() => {
    connectToSocket()  
  }, [socket])

  useEffect(() => {
    if(chat && chatid && chat._id) {
      handleSendMessages()
    }

    return () => {
      socket.off("message_received")
    }
  }, [chat, chatid, socket])
  
  useEffect(() => {
    if(replyMessage || forwardMessage) {
      setShowSidebar(false)
    }
  }, [replyMessage, forwardMessage])


  useEffect(() => {
    setReplyMessage(null)
    if(chat && isSocketConnected) {

      if(prevChat) {
        socket.emit("leave_room", prevChat._id)
      }

      setPageOfMessages(1)
      setContentToEdit(null)
      setPreviousScrollHeight(document.documentElement.scrollHeight)
      dispatch(getMessages({ socket, chatid: chat._id, limit: LIMIT_OF_MESSAGES, page: 1 }))
    }
  }, [chat])

  useEffect(() => {
    if(chatid  && chatid !== undefined) {
      if(chat && chat._id) {
        return 
      } else {
        dispatch(getMessages({ socket, chatid, limit: LIMIT_OF_MESSAGES, page: 1 }))
        .then(data => {
          if(!data.payload.messages) {
            navigate("/page404")
          }
        })
        
      }
    } else {
    }
  }, [chatid, useParams])

  const handleDeleteMessages = async () => {
    socket.on("message_deleted", (id) => {
      dispatch(deleteMessages(id))
    })
  }

  const handleUpdateMessages = async () => {
    socket.on("message_updated", (messageToUpdate) => {
      dispatch(updateMessages(messageToUpdate))
    })
  }

  const handleLikeMessages = async () => {
    socket.on("message_liked", (message) => {
      dispatch(updateMessages(message))
    })
  }

  const handleUnlikeMessages = async () => {
    socket.on("message_unliked", (message) => {
      dispatch(updateMessages(message))
    })
  }

  useEffect(() => {
    handleDeleteMessages()
    handleUpdateMessages()
    handleLikeMessages()
    handleUnlikeMessages()
  }, [messages])
  

  useEffect(() => {
    if (pageOfMessages === 1) {
      scrollToTheBottom(document.documentElement.scrollHeight, "smooth")
    } else {
      scrollToTheBottom(previousScrollHeight, "auto")
    }
  }, [messages])


  const handleOpenImage = (image) => {
    setIsImageOpened(!isImageOpened)
    setImageToOpen(image)
  }

  const handleScroll = useCallback((e) => {
    setOpenContextMenu(false)
    setCoords({ x: 0, y: 0 })
    if (e.currentTarget.scrollY === 0 && chat._id && pageOfMessages < maxPages) {
      setShowBottomButton(true)
      dispatch(getMessages({ socket, chatid: chat._id, limit: LIMIT_OF_MESSAGES, page: pageOfMessages + 1 }))
      setPageOfMessages(pageOfMessages + 1)
      setPreviousScrollHeight(document.documentElement.scrollHeight)
    } 
    if (document.body.clientHeight - 464 - e.currentTarget.scrollY > 800) {
      setShowBottomButton(true)
    } else {
      setShowBottomButton(false)
    } 
  }, [pageOfMessages, chat, showBottomButton])

  useEffect(() => {
    const handleClick = () => setOpenContextMenu(false)
    if(chat._id) {
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("click", handleClick)
    }
    }
  }, [handleScroll])

  const handleContextMenu = (e, item) => {
    e.preventDefault()
    setOpenContextMenu(item)
    setCoords({
      x: e.pageX,
      y: e.pageY
    })
  }

  const handleOpenReply = (replyId) => {
    setShowSidebar(false)
    if(!document.getElementById(replyId)) {
      dispatch(getMessages({ socket, chatid: chat._id, limit: LIMIT_OF_MESSAGES, page: pageOfMessages + 1 }))
        .then(data => {
          setPreviousScrollHeight(document.getElementById(replyId).offsetTop)
        })
      setPageOfMessages(pageOfMessages + 1)
    } else {
      const offSetTop = messageRefs.current.find(elem => elem.id === replyId).offsetTop
      scrollToTheBottom(offSetTop - 60, "smooth")
    }
  }

  const joinChannel = async () => {
    dispatch(addMember({ chatId: chat._id, userId: user._id }))
      .then(data => {
        window.location.reload()
      })
  }

  const likeMsg = async (message) => {
    dispatch(likeMessage({ socket, message }))
  }

  const unlikeMsg = async (message) => {
    dispatch(unlikeMessage({ socket, message }))
  }
  
    return (
        <div className={showSidebar ? "chat" : "chat-fullscreen"}>
          <div className="message-display"
            style={{ overflowY: "auto" }}
          >
          { 
            (messages.length !== 0 && chat)?
            messages.map((item, i) => {
            return (
              <div 
                className="message" 
                key={item._id} 
                id={item._id} 
                ref={(el) => (messageRefs.current[i] = el)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <img
                  src={ item.from.profileImage.url ? item.from.profileImage.url : sheldon}
                  alt=""
                  onClick={() => setShowProfile(item.from)}
                />
                <div>
                  <div className="message-header">
                    <p className="username" onClick={() => setShowProfile(item.from)}>{item.from.username}</p>
                    <p className="date">{formatDistance(subDays(new Date(), 0), new Date(item.createdAt), { addSuffix: true })}</p>
                  </div>
                  <div className="message-text">
                    {
                      item.replyToMessage && item.replyToMessage._id &&
                      <div 
                        // href={`#${item.replyToMessage._id}`} 
                        className="display-reply-message" 
                        onClick={() => handleOpenReply(item.replyToMessage._id)}
                      >
                        <p className="username">{item.replyToMessage.from.username}</p>
                        <p className="content">
                        {item.replyToMessage.content && item.replyToMessage.content}
                        {
                          !item.replyToMessage.content && item.replyToMessage.images.length &&
                          "A message"
                        }
                        {
                          !item.replyToMessage.content && item.replyToMessage.voiceMessage.url &&
                          "A voice message"
                        }
                        </p>
                      </div>
                    }
                    {
                      item.forwardedMessage && item.forwardedMessage._id && 
                      <div 
                        className="display-reply-message"
                        onClick={() => setShowProfile(item.forwardedMessage.from)}
                      >
                        <p className="username">{t("forwardedFrom")} {item.forwardedMessage.from.username}</p>
                        <p className="content">
                          {item.forwardedMessage.content && item.forwardedMessage.content}
                        </p>
                      </div>
                    }
                    {
                      <p dangerouslySetInnerHTML={{ __html: detectLinks(item.content) }} />
                    }
                      {
                        item.images.length !== 0 &&
                        <div className="attached-images-section">
                        {item.images.map((image) => {
                          return (
                            <>
                              <img
                                className="attached-image" 
                                src={image.url}
                                alt=""
                                onClick={() => handleOpenImage(image)}
                              />
                            </>
                          )
                        })}
                        </div>
                      }
                      {
                        item.voiceMessage && item.voiceMessage.url &&
                        <div className="voice-message">
                          <VoiceMessagePlayer 
                            audioSrc={item.voiceMessage}
                          />
                        </div>
                      }
                      {
                        item && item.likes && item.likes.length ?      
                        <div className={`likes-container  ${item.likes.includes(user._id) ? "liked-by-user" : "not-liked-by-user"}`}>
                          <span 
                            className="material-symbols-outlined"
                            onClick={item.likes.includes(user._id) ? () => unlikeMsg(item) : () => likeMsg(item)}
                          >
                            favorite
                          </span>
                          <p>{ item.likes.length }</p>
                        </div> :
                        <></>
                      }
                      {
                        item.wasMessageUpdated &&
                        <span className="was-message-edited">Edited</span>
                      }
                    </div> 
                </div>
              </div>
            )
          }) : <div className="message-for-user">
              {t("messageDisplay")}
            </div>
          }
          </div>

          {
            openContextMenu && openContextMenu.from._id && coords &&
            <Menu
              item={openContextMenu}
              coords={coords}
              socket={socket}
              setReplyMessage={setReplyMessage}
              setContentToEdit={setContentToEdit}
              likeMsg={likeMsg}
              unlikeMsg={unlikeMsg}
              setForwardMessage={setForwardMessage}
              setShowSelectChatToForward={setShowSelectChatToForward}
            />
          }

          {
            isTyping && user.username !== isTyping &&
            <IsTyping 
              username={isTyping}
            />
          }

          {
            showBottomButton &&
            <div className="scroll-button" onClick={() => scrollToTheBottom(document.documentElement.scrollHeight, "smooth")}>
              <span className="material-symbols-outlined">
                  arrow_downward
              </span>
            </div>
          }
          
          {
            chat && !chat.isChannel &&
            <MessageInput 
              socket={socket} 
              isSocketConnected={isSocketConnected} 
              setIsTyping={setIsTyping}
              isTyping={isTyping}
              replyMessage={replyMessage} 
              setReplyMessage={setReplyMessage}
              forwardMessage={forwardMessage}
              setForwardMessage={setForwardMessage}
              contentToEdit={contentToEdit}
              setContentToEdit={setContentToEdit}
            />
          }

          {
            chat && chat.isChannel &&
            chat.admin._id === user._id &&
            <MessageInput 
              socket={socket} 
              isSocketConnected={isSocketConnected} 
              setIsTyping={setIsTyping}
              isTyping={isTyping}
              replyMessage={replyMessage} 
              setReplyMessage={setReplyMessage}
              forwardMessage={forwardMessage}
              setForwardMessage={setForwardMessage}
              contentToEdit={contentToEdit}
              setContentToEdit={setContentToEdit}
            />
          }

          {
            chat && chat.isChannel && chatid &&
            chat.admin._id !== user._id &&
            !chats.some(item => item._id === chatid) &&
            <div className="join-channel-container">
              <span 
                className="join-channel"
                onClick={joinChannel}
              >
                Join Channel
              </span>
            </div>
          }

          {
            isImageOpened &&
            <SingleImageComponent image={imageToOpen} setIsImageOpened={setIsImageOpened} />
          }

          {
            showSelectChatToForward && forwardMessage && chats &&
            <SelectChatToForward 
              forwardMessage={forwardMessage}
              setForwardMessage={setForwardMessage}
              setShowSelectChatToForward={setShowSelectChatToForward}
            />
          }

          {
            showProfile &&
            <Profile 
              setShowProfile={setShowProfile}
              user={showProfile}
            />
          }
          
        </div>
      )
}