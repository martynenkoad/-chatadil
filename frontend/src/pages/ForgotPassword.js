import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, reset } from "../redux/auth/authSlice"
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import { useTranslation } from "react-i18next"

export default function ForgotPassword() {

    const [email, setEmail] = useState("")
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const { t } = useTranslation()

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } else if (isSuccess) {
            toast.success("Please check your email!")
        }
    }, [isError, isSuccess, message])

    const handleSubmit = async (e) => {
        e.preventDefault()

        dispatch(forgotPassword({ email }))
        dispatch(reset())
    }

    return (
        <form 
          onSubmit={handleSubmit}
          className="forgot-password-page"
        >
            <h3>{t("forgotPasswordHeader")}</h3>
            <h4>{t("forgotPasswordParagraph")}</h4>
            <input 
              type="email"
              value={email}
              placeholder={t("emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="follow-btn">&rarr;</button>
            { isLoading ? <Loading /> : <></> }
        </form>
    )
}