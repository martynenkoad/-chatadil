import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reset, resetPassword } from "../redux/auth/authSlice"
import { toast } from "react-toastify"
import Loading from "../components/Loading"

export default function PasswordRecovery() {

    const { token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)
    
    const [show, setShow] = useState(false)
    const [password, setPassword] = useState("")

    const toggleShow = () => setShow(!show)

    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch(resetPassword({ token, password }))
        dispatch(reset())
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } else if (isSuccess) {
            toast.success(message)
            navigate("/login")
        }
    }, [isSuccess, isError, message])

    return (
        <form 
          className="forgot-password-page"
          onSubmit={handleSubmit}
        >
            <h3>{t("resetPassword")}</h3>
            <div className="input-section">
              <label htmlFor="password">
                {t("enterNewPassword")}
              </label>
              <input 
                id="password"
                type={show ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="material-symbols-outlined visibility"
                onClick={toggleShow}
              >
                {show ? "visibility_off" : "visibility"}
              </span>
            </div>
            <button className="follow-btn">&rarr;</button>
            { isLoading ? <Loading /> : <></> }
        </form>
    )
}