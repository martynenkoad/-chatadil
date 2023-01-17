import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createGroupChat } from "../redux/chat/chatSlice"
import { toast } from "react-toastify"
import SingleUser from "./SingleUserComp"
import sheldon from "../assets/sheldon.png"
import Loading from "./Loading"
import { useTranslation } from "react-i18next"

export default function CreateGroupChat({ isChannel }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { user, users } = useSelector((state) => state.auth)
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.chat)

    const [chatName, setChatName] = useState("")
    const [description, setDescription] = useState("")

    const [chatImage, setChatImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [uploading, setUploading] = useState(false)

    const [members, setMembers] = useState([])

    const validateImage = (e) => {
        const file = e.target.files[0]
        if(file.size > 1048576) {
            toast.error("Max Image Size is 1MB.")
        } else {
            setChatImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const uploadImage = async () => {
        setUploading(true)
        const fd = new FormData()

        fd.append("file", chatImage)
        fd.append("upload_preset", "chatUpload")

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dhhs6snzd/image/upload/", {
                method: "POST",
                body: fd
            })

            const urlData = await response.json()
            setUploading(false)
            return {
                public_id: urlData.public_id,
                url: urlData.url
            }
        } catch (error) {
            setUploading(false)
            toast.error(error.message)
        }
    } 

    const handleSelect = (id) => {
        members.includes(id) ? setMembers(members.filter((_id) => _id !== id)) : setMembers(prevMembers => { return [...prevMembers, id] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let image
        if(!chatImage) {
            image = { public_id: "", url: "" }
        } else {
            const { public_id, url } = await uploadImage()
            image = { public_id, url }
        }

        dispatch(createGroupChat({ chatName, description, chatImage: image, isGroupChat: true, isChannel, members }))

        navigate("/chat")
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
    }, [isError, isLoading, isSuccess])

    return (
        <form className="create-group-chat" >
            <div className="group-info">
                <div className="image-upload-section">
                    <img 
                      src={previewImage ? previewImage : sheldon}
                      className="preview-image"
                      alt=""
                    />
                    
                    <label htmlFor="image-upload">
                    <span className="material-symbols-outlined image-upload">
                      add_photo_alternate
                    </span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      hidden
                      onChange={validateImage}
                      accept="image/jpeg, image/jpg, image"
                    />
                </div>
                
                <div className="inputs">
                    <div className="input-section">
                      <label htmlFor="chatName">{t("chatNameLabel")}</label>
                      <input
                        id="chatName" 
                        placeholder={ t("chatNamePlaceholder") }
                        type="text"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                      />
                    </div>

                    <div className="input-section">
                        <label htmlFor="desc">{t("chatDescription")}</label>
                        <textarea 
                          placeholder={ t("descriptionPlaceholder") }
                          maxLength={200}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                
                </div>
            </div>

            {
                !isChannel ?
                <div>
                    <h2>{t("createGroupChatHeader")}</h2>
                    {
                        users && user &&
                        users.map(item => {
                            return (
                                <div key={item._id} className="room" onClick={() => { handleSelect(item._id) }}>
                                    {
                                        user._id !== item._id &&
                                        <>
                                          <SingleUser item={item} isGroupChatComp={true} rightItem={members.includes(item._id) ? "done" : "add"} />
                                        </>
                                    }
                                </div>
                            )
                        })
                    }
                </div> :
                <></>
            }
            <button className="follow-btn" onClick={handleSubmit}>{t("createChatButton")}</button>

            {
              isLoading || uploading ? <Loading /> : <></>
            }
        </form>
    )
}