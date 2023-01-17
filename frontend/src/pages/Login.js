import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useGoogleLogin } from "@react-oauth/google"
import { login, loginViaGoogle, reset } from "../redux/auth/authSlice"
import crocodile from "../assets/crocodile.png"
import Loading from "../components/Loading"
import { useTranslation } from "react-i18next"

export default function Login() {

    const { t } = useTranslation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [isShown, setIsShown] = useState(false)

    const toggle = () => setIsShown(!isShown)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    useEffect(() => {
      if(isError) {
        toast.error(message)
      }

      if(isSuccess && user) {
        navigate('/')
      }
      dispatch(reset())
    }, [user, isError, isSuccess, message])

    const handleSubmit = (e) => {
      e.preventDefault()
      dispatch(login({ email, password }))
    }

    const handleLoginSuccess = (response) => {
      const googleAccessToken = response.access_token

      dispatch(loginViaGoogle(googleAccessToken))
    }

    const logInViaGoogle = useGoogleLogin({ onSuccess: handleLoginSuccess })

    return (
        <form 
          className="login"
        >
          <div>
            <img 
              src={crocodile}
              alt=""
            />
          </div>
          <div className="right-side">
            <div className="header">
              <h1>Chatadil</h1>
              <p>{t("header")}</p>
            </div>
            <p>
              {t("loginParagraph")}
            </p>
            <div className="input-section">
              <label 
                htmlFor="username"
              >{t("emailLabel")}</label>
              <input 
                id="username"
                type="email"
                placeholder={ t("emailPlaceholder") }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="input-section password-section">
              <label
                htmlFor="password"
              >{t("passwordLabel")}</label>
                <input 
                  id="password"
                  type={isShown ? "text" : "password"}
                  placeholder={ t("passwordPlaceholder") }
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
            <button 
              className="follow-btn"
              onClick={handleSubmit}
            >{t("loginButton")}</button>
            {/* <span className="or">or</span>
            <button 
              className="google-btn"
              onClick={() => logInViaGoogle()}
            >Sign in with Google</button> */}
            <div className="down-text">
              <p>{t("loginFooter1")} <Link to="/signup">{t("loginLink1")} &rarr;</Link></p>
              <p>{t("loginFooter2")} <Link to="/forgotten-password">{t("loginLink2")} &rarr;</Link></p>
            </div>
          </div>
          {isLoading ? <Loading /> : <></>}
        </form>
    )
}