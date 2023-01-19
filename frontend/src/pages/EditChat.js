import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Navbar from "../components/Navbar"
import { useSelector, useDispatch } from "react-redux"
import { getChat, updateChat } from "../redux/chat/chatSlice"
import { getUsers } from "../redux/auth/authSlice"
import crocodile from "../assets/crocodile.png"
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import UserSearchbar from "../components/UserSearchbar"
import defaultSettings from "../api/defaultSettings"

export default function EditChat() {

    const { t } = useTranslation()
    const { chatid } = useParams()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { foundChatToEdit, isError, message, isLoading } = useSelector((state) => state.chat)

    const [chatName, setChatName] = useState(foundChatToEdit ? foundChatToEdit.chatName : "")
    const [description, setDescription] = useState(foundChatToEdit ? foundChatToEdit.description : "")
    const [members, setMembers] = useState([])

    const [uploading, setUploading] = useState(false)
    const [chatImageWasChanged, setChatImageWasChanged] = useState(false)
    const [chatImage, setChatImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)


    useEffect(() => {
        dispatch(getChat(chatid))
          .then(data => {
            setChatImage(data.payload.chatImage.url)
            setChatName(data.payload.chatName)
            setDescription(data.payload.description)
            setMembers(data.payload.members)

        })
    }, [])

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
    }, [isError, message])

    const validateImage = (e) => {
        const image = e.target.files[0]

        if(image.size > 1048576) {
            toast.error("Max file size should be 1 mb.")
        } else {
            setChatImage(image)
            setPreviewImage(URL.createObjectURL(image))
        }

        setChatImageWasChanged(true)
    }

    const uploadImage = async () => {
        const fd = new FormData()

        fd.append('file', chatImage)
        fd.append('upload_preset', 'chatUpload')

        try {
            setUploading(true)
            const response = await fetch("https://api.cloudinary.com/v1_1/dhhs6snzd/image/upload/", {
              method: "POST",
              body: fd
            })

            const urlData = await response.json()
            setUploading(false)
            return { public_id: urlData.public_id, url: urlData.url }
        } catch (error) {
            setUploading(false)
            toast.error(error.message || error.toString())
        }
    }

    const editChat = async (e) => {
        e.preventDefault()

        let items = {
            chatId: chatid,
            chatName,
            description,
            members
        }
        if(chatImageWasChanged) {
            const { url, public_id } = await uploadImage()
            items["chatImage"] = { url, public_id }
            dispatch(updateChat(items))
        } else {
            items["chatImage"] = { url: "", public_id: "" }
            dispatch(updateChat(items))
        }

        if(!isError && !isLoading) {
            toast.success(`The chat ${chatName} was successfully updated!`)
        }
    }

    const handleSelect = (member) => {
        members.includes(member) ? setMembers(members.filter((singleMember) => singleMember._id !== member._id)) : setMembers(prevMembers => { return [...prevMembers, member] })
    }

    const copyToClipboard = () => {
        const text = document.getElementById("copy")
            navigator.clipboard.writeText(text.innerText.toString())
              .then(() => {
                toast.success("The link was successfully copied!")
              })
              .catch((error) => {
                toast.error(`Unable to copy the link due to the problem: ${error.message || error.toString()}`)
              })
    }

    return (
        <>
          <Navbar />
          <div className="edit-chat">
            <div className="edit-chat-header">
                <Link to="/">
                    <span className="material-symbols-outlined">
                      arrow_back_ios
                    </span>
                    { t("returnHome") }
                </Link>

                <h2>{ t("chatSettings") }</h2>
            </div>


            <div className="main-section">
            {
                foundChatToEdit &&
                  <div className="inputs">
                      <div className="input-section">
                        <label htmlFor="chatName">{t("chatNameLabel")}</label>
                        <input
                          id="chatName" 
                          placeholder="Chat Name...."
                          type="text"
                          value={chatName}
                          onChange={(e) => setChatName(e.target.value)}
                        />
                      </div>

                      <div className="input-section">
                          <label htmlFor="desc">{t("chatDescription")}</label>
                          <textarea 
                            id="desc"
                            placeholder="Description...."
                            maxLength={200}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                      </div>
                
                    </div>
            }

            {
                foundChatToEdit &&
                <div className="edit-chat-image">
                    <img 
                      className={(foundChatToEdit.chatImage.url || previewImage) ? "chat-image" : "preset-chat-image"}
                      src={previewImage || foundChatToEdit.chatImage.url || crocodile}
                      alt=""
                    />

                    <label htmlFor="upload-image">
                      <span className="material-symbols-outlined image-upload">
                        add_photo_alternate
                      </span>
                    </label>

                    <input 
                      id="upload-image"
                      type="file"
                      hidden
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={validateImage}
                    />
                </div>
            }

            </div>

            {
                foundChatToEdit && foundChatToEdit.isChannel &&
                <div 
                  className="chat-link" 
                >
                    <h4>Link: </h4>
                    <p id="copy">{`${defaultSettings.homeUrl}/chat/${foundChatToEdit._id}`}</p>
                    <span 
                      className="material-symbols-outlined"
                      onClick={copyToClipboard}
                    >
                        content_copy
                    </span>
                </div>
            }

            {
                foundChatToEdit && members.length && 
                <div className="edit-chat-members">
                    <h4>{ t("sidebarMembers") }</h4>
                    {
                        members.map((singleUser, index) => {
                            return (
                                <div key={index}>
                                    {
                                        singleUser._id !== user._id &&
                                        <div className="single-member">
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
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            }
            
            <UserSearchbar 
              chatid={chatid}
              members={members}
              handleSelect={handleSelect}
            />
            
            <span 
              className="follow-btn"
              onClick={editChat}
              disabled={isLoading || uploading}
            >
                { t("edit") }
            </span>
            </div>

            {
                (uploading || isLoading) &&
                <Loading />
            }
        </>
    )
}
