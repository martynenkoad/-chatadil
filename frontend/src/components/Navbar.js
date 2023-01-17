import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../redux/auth/authSlice"
import crocodile from "../assets/crocodile.png"
import Profile from "../components/Profile"
import { useTranslation } from "react-i18next"

export default function Navbar() {
  const [showContent, setShowContent] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const toggle = () => setShowContent(!showContent)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const logOut = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/login')
  }

  const toggleProfile = () => { 
    setShowContent(false)
    setShowProfile(true) 
  }

  const { t } = useTranslation()
    
  return (
    <div className="navbar">
      <div className="navbar-section">
          <img 
            className="icon"
            src={crocodile}
            alt=""
          />
          <h1><Link to="/">Chatadil</Link></h1>
          <span>{t("header")}</span>
      </div>
      <div className="navbar-user-info">
        <div onClick={toggleProfile}>
            <img 
              className={user.profileImage.url ? "user-image" : "preload-image"}
              alt=""
              src={user.profileImage.url ? user.profileImage.url : crocodile}
            /> 
            <span className="username">{user.username}</span>
        </div>
          <span 
            className="material-symbols-outlined"
            onClick={toggle}
          >
            {showContent ? "arrow_drop_up" : "arrow_drop_down"}
          </span>
      </div>
      {
        showContent ? 
          <div className="dropdown">
            <Link to="/settings">
              <span className="material-symbols-outlined">
                settings
              </span>
              {t("dropdown1")}
            </Link>
            <div
              onClick={toggleProfile}
            >
              <span class="material-symbols-outlined">
                person
              </span>
              {t("dropdown2")}
            </div>
            <p onClick={logOut}>
              {t("dropdown3")}
            </p>
          </div> 
        : <></>
      }

      {
        showProfile ? 
        <Profile 
          setShowProfile={setShowProfile}
          user={user}
        /> :
        <></>
      }
    </div>
  )
}

/**
 * <div>
              <Link to="/">
                Home
              </Link>
              {user ? <>
                <button 
                  className="btn-2-min"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </> : <>
                <Link to="/signup">
                  Sign Up
                </Link>
                <Link to="/login">
                  Log in
                </Link>
              </>}
            </div>
 */