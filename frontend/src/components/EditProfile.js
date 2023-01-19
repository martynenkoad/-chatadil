import React, { useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import sheldon from "../assets/sheldon.png"
import { editProfile } from "../redux/auth/authSlice"
import { useTranslation } from "react-i18next"

export default function EditProfile() {

    const { user } = useSelector((state) => state.auth)

  const [firstName, setFirstName] = useState(user ? user.firstName : "")
  const [lastName, setLastName] = useState(user ? user.lastName : "")
  const [username, setUsername] = useState(user ? user.username : "")

  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [profileImage, setProfileImage] = useState(user ? user.profileImage : null)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const validateImage = (e) => {
    const image = e.target.files[0]

    if(image.size > 1048576) {
      toast.error("Max file size should be 1 mb.")
    } else {
      setProfileImage(image)
      setPreviewImage(URL.createObjectURL(image))
    }
  }

  const uploadImage = async () => {
    const fd = new FormData()

    fd.append('file', profileImage)
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
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!profileImage) {
      dispatch(editProfile({ firstName, lastName, username, profileImage: { public_id: "", url: "" } }))
    } else {
      const { url, public_id } = await uploadImage(profileImage)
      dispatch(editProfile({ firstName, lastName, username, profileImage: { public_id, url } }))
    }
  }

    return (
        <form 
          className="edit-profile-form"
          onSubmit={handleSubmit}
        >
                <div>
                  <div className="input-section">
                    <label htmlFor="firstName">{ t("firstNameLabel") }</label>
                    <input 
                      id="firstName"
                      type="text"
                      maxLength={25}
                      placeholder={ t("firstNamePlaceholder") }
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="input-section">
                    <label htmlFor="lastName">{ t("lastNameLabel") }</label>
                    <input 
                      id="lastName"
                      type="text"
                      maxLength={25}
                      placeholder={ t("lastNamePlaceholder") }
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="input-section">
                    <label htmlFor="username">{ t("usernameLabel") }</label>
                    <input 
                      type="text"
                      maxLength={16}
                      placeholder={ t("usernamePlaceholder") }
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <button className="follow-btn">{ t("edit") }</button>
                </div>
                <div className="upload-image-section">
                  <img 
                    src={previewImage || profileImage.url || sheldon} 
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
              </form>
    )
}