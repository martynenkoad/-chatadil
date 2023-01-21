import sheldon from "../assets/sheldon.png"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { signup, reset } from "../redux/auth/authSlice"
import giraffe from "../assets/giraffe.png"
import Loading from "../components/Loading"
import { useTranslation } from "react-i18next"

export default function Signup() {

    const { t } = useTranslation()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // states to handle profile image uploading
    const [profileImage, setProfileImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const [isShown, setIsShown] = useState(false)

    const toggle = () => setIsShown(!isShown)

    const validateImage = (e) => {
      const file = e.target.files[0]
      if(file.size > 1048576) {
        toast.error('Max size of image should be 1 mb.')
      } else {
        setProfileImage(file)
        setPreviewImage(URL.createObjectURL(file))
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

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth )

    useEffect(() => {
      if(isError) {
        toast.error(message)
      }
      if(isSuccess && user) {
        navigate("/")
      }

      dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const handleSubmit = async (e) => {
      e.preventDefault()
      if(!profileImage) {
        dispatch(signup({ firstName, lastName, username, email, password, profileImage: { public_id: "", url: "" } }))
      } else {
          const { url, public_id } = await uploadImage(profileImage)
          dispatch(signup({ firstName, lastName, username, email, password, profileImage: { public_id, url } }))
      }
    }

    
    return (
        <form 
          className="signup"
        >
          <div>
            <img 
              src={giraffe}
              alt=""
            />
          </div>
          <div className="right-side">
              <div className="header">
                <h1>Chatadil</h1>
                <p>{t("signUpHeader")}</p>
              </div>
              <div className="input-section">
                <label htmlFor="firstName">{t("firstNameLabel")} </label>
                <input 
                  type="text"
                  id="firstName"
                  placeholder={ t("firstNamePlaceholder") }
                  maxLength={25}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-section">
                <label htmlFor="lastName">{t("lastNameLabel")} </label>
                <input 
                  type="text"
                  id="lastName"
                  placeholder={ t("lastNamePlaceholder") }
                  maxLength={25}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="input-section">
                <label htmlFor="username">{t("usernameLabel")} </label>
                <input 
                  type="text"
                  id="username"
                  placeholder={ t("usernamePlaceholder") }
                  maxLength={16}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-section">
                <label htmlFor="email">{t("emailLabel")} </label>
                <input 
                  type="email"
                  id="email"
                  placeholder={ t("emailPlaceholder") }
                  maxLength={50}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="input-section">
                <label htmlFor="password">{t("passwordLabel")} </label>
                <div className="password-section">
                  <input 
                    type={isShown ? "text" : "password"}
                    id="password"
                    placeholder={ t("passwordPlaceholder") }
                    maxLength={40}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span 
                    className="material-symbols-outlined visibility"
                    onClick={toggle}
                  >
                    {!isShown ? 'visibility' : 'visibility_off'}
                  </span>
                </div>  
              </div>

              <div className="input-section">
              <label className="profile-image-label" htmlFor="image-upload">
                  {t("profileImageLabel")}
                </label>
              </div>
              <div className="image-upload-section">
                  <img 
                    className={previewImage ? "preview-image" : "null-preview-image"}
                    alt=""
                    src={previewImage ? previewImage : null}
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
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={validateImage}
                  />
                </div>
 
              <button 
                className="follow-btn"
                onClick={handleSubmit}
              >{t("signupButton")}</button>

              <p>{t("signupFooter")} <Link to="/login">{t("signupLink")} &rarr;</Link></p>
            </div>
            {isLoading || uploading ? <Loading /> : <></>}
        </form>
    )
}

 