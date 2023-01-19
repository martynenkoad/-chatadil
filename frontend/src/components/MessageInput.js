import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { sendMessage, updateMessage } from "../redux/message/messageSlice"
import ImagesPreview from "./ImagesPreview"
import { useTranslation } from "react-i18next"
import VoiceRecorder from "./VoiceRecorder"
import ReplyPreview from "./ReplyPreview"
import ForwardPreview from "./ForwardPreview"

export default function MessageInput({ socket, isSocketConnected, isTyping, setIsTyping, replyMessage, setReplyMessage, forwardMessage, setForwardMessage, contentToEdit, setContentToEdit }) {


    const [showInput, setShowInput] = useState(true)
    // States to handle the image uploading
    const [images, setImages] = useState([])
    const [previewImages, setPreviewImages] = useState([])
    const [areImagesSelected, setAreImagesSelected] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [isMessageBeingUpdated, setIsMessageBeingUpdated] = useState(false)

    const [content, setContent] = useState("")

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { chat } = useSelector((state) => state.message)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
      if(contentToEdit && contentToEdit.content && contentToEdit.content !== content) {
        setContent(contentToEdit.content)
        setIsMessageBeingUpdated(true)
      } else {
        setContent("")
      }
    }, [contentToEdit])


      const handleTyping = (e) => {
        setContent(e.target.value)
        if(!isSocketConnected) return

        if(!isTyping) {
          setIsTyping(false)
          socket.emit("typing", chat._id, user.username)
        }

        let initTime = new Date().getTime()
        setTimeout(() => {
          let currentTime = new Date().getTime()
          if (currentTime - initTime > 2000) {
            setIsTyping(false)
            socket.emit("stop_typing", chat._id, user.username)
          }
          if (!e.target.value.trim()) {
            setIsTyping(false)
            socket.emit("stop_typing", chat._id, user.username)

          }
        }, 2000)
      }

      const validateImages = (e) => {
        setAreImagesSelected(true)
        const files = Array.from(e.target.files)
        socket.emit("stop_typing", chat._id, user.username)
        if(files.length > 4) {
          return toast.error("Max amount of images is 4.")
        }

        files.forEach((file) => {

            let uploadedImage = {
              src: URL.createObjectURL(file)
            }

            const temp = new Image()
            temp.src = uploadedImage.src

            temp.onload = () => {
              uploadedImage["height"] = temp.height
              uploadedImage["width"] = temp.width
            }


            setPreviewImages(prevImages => {
              return [uploadedImage, ...prevImages].slice(0, 4)
            })
          setImages(prevImages => [file, ...prevImages].slice(0, 4))

        })
      }

      const handleSubmit = async (e) => {
        e.preventDefault()

        if(!content.trim() && images.length === 0 && !forwardMessage) {
          toast.error("Your message can not be empty.")
          return
        } 

        if (isMessageBeingUpdated) {
          if(contentToEdit.content !== content) {
            dispatch(updateMessage({ socket, message: contentToEdit, content }))
            .then(data => {
              setContent("")
              setIsMessageBeingUpdated(false)
            })
          } else {
            setContent("")
            setIsMessageBeingUpdated(false)
          }
        } else {
          setUploading(true)
    
          let fd = new FormData()
          images.forEach(image => {
            fd.append("images[]", image)
          })
          fd.append("content", content)
          if(replyMessage) {
            fd.append("replyMessage", replyMessage._id)
          }
          if(forwardMessage) {
            fd.append("forwardedMessage", forwardMessage._id)
          }

          setAreImagesSelected(false)
  
          dispatch(sendMessage({
            socket,
            chat: chat._id,
            fd
          }))
          setContent("")
          setUploading(false)
          setImages([])
          setPreviewImages([])
          setReplyMessage(null)
          setForwardMessage(null)
              
        }
      }


    return (
        <>
        { 
          chat._id &&
          <form 
          className="message-input-container"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        > 
          {
            showInput && 
            images && previewImages && areImagesSelected &&
            <ImagesPreview 
              previewImages={previewImages} 
              images={images}  
              setImages={setImages}
              setPreviewImages={setPreviewImages}
            />
          }

          {
            showInput && replyMessage &&
            <ReplyPreview 
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
            />
          }
          {
            showInput && forwardMessage &&
            <ForwardPreview 
              forwardMessage={forwardMessage}
              setForwardMessage={setForwardMessage}
            />
          }
          {
            showInput && contentToEdit && isMessageBeingUpdated &&
            <a href={`#${contentToEdit._id}`} className="content-to-edit-container">
              <span 
                className="material-symbols-outlined close"
                onClick={() => setContentToEdit(null)}
              >
                close
              </span>
              <h4>Edit Message</h4>
              <p>{contentToEdit.content}</p>
            </a>
          }
        <div             
          className="message-input"
        >
          {
            showInput &&
            <input
              disabled={uploading || !chat}
              maxLength={2000}
              type="text"
              placeholder={ t("messagePlaceholder") }
              value={content}
              onChange={(e) => handleTyping(e)}
            />
          }
            
          {
            showInput &&
            <div className="attach-file">
            <input 
              disabled={uploading || !chat}
              id="images-upload"
              type="file"
              max={4}
              onChange={validateImages}
              multiple
              hidden
              accept="image/png, image/jpeg, image/jpg, image/gif"
            />
              <label htmlFor="images-upload">
                <span className="material-symbols-outlined">
                  attach_file
                </span>
              </label>
          </div>
          }

          <VoiceRecorder 
            showInput={showInput}
            setShowInput={setShowInput}
            chatid={chat._id}
            socket={socket}
          />
          {
            showInput &&
            <button disabled={uploading || !chat}>
              <span className="material-symbols-outlined send">
                send
              </span>
            </button>
          }

          </div>
        </form>
        }
        </>
    )
} 