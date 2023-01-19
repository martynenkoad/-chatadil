import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getUsers } from "../redux/auth/authSlice"
import SingleUser from "./SingleUserComp"
import { useTranslation } from "react-i18next"

export default function CreateChat() {
    const { users, user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(getUsers()) 
    }, [])


    return (
        <div className="create-chat">
            <h2>{t("createChatHeader")}</h2>
            {users.map(item => {
                return (
                    user._id !== item._id &&
                    <div className="room" id={item._id} key={item._id}>
                        <SingleUser item={item} isGroupChatComp={false} rightItem="arrow_right_alt" />
                    </div>
                )
            })}
            
        </div>
    )
}