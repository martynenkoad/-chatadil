import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import crocodile from "../assets/crocodile.png"
import { useTranslation } from "react-i18next"

export default function Profile({ setShowProfile, user }) {

    const { user: defaultUser } = useSelector((state) => state.auth)

    const { t } = useTranslation()
 
    return (
        <div className="profile-container">
          <div className="profile"> 
            <p 
              className="close"
              onClick={() => setShowProfile(false)}
            >
                x
            </p>
            <div className="user-info">
              <img
                className={user.profileImage.url ? "" : "preload-image"} 
                src={user.profileImage.url ? user.profileImage.url : crocodile}
                alt=""
              />
                <p className="username" style={{ display: "flex", alignItems: "center" }}>
                  {user.username} 
                  {
                    defaultUser._id === user._id &&
                    <Link to="/settings">
                    <span className="material-symbols-outlined" style={{ color: "black" }}>
                      edit
                    </span>
                  </Link>
                  }
                </p>
                
              <div>
                  <p>{t("profileName")} <span>{user.firstName}</span></p>
                  <p>{t("profileSurname")} <span>{user.lastName}</span></p>
                  <p>{t("profileEmail")} <span>{user.email}</span></p>
              </div>
            </div>
          </div>
        </div>
    )
} 