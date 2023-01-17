import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import EditProfile from "../components/EditProfile"
import LocaleContext from "../redux/localeContext"
import i18n from "../utils/i18n"
import { useTranslation } from "react-i18next"

export default function Settings() {

  const { locale } = useContext(LocaleContext)
  const { t } = useTranslation()

  const [language, setLanguage] = useState(locale ? locale : "")

  const changeLocale = (lang) => {
    if(locale !== lang) {
      setLanguage(lang)
      i18n.changeLanguage(lang)
    }
  }

    return (
        <div className="settings-container"> 
          <Navbar />
          <div className="settings">

            <div className="settings-header">
              <Link to="/">
                <span className="material-symbols-outlined">
                  arrow_back_ios
                </span>
                {t("returnHome")}
              </Link>
              <h1>{t("dropdown1")}</h1>
            </div>
          
          <h2>{t("settingsHeader1")}</h2>
              <EditProfile />

            <h2>{t("settingsHeader3")}</h2>
            <select
              className="locale-select-box"
              value={language}
              onChange={(e) => changeLocale(e.target.value)}
            >
              <option 
                value=""
              >-- Change Locale --</option>
              <option 
                value="en"
              >
                English
              </option>
              <option 
                value="uk"
              >
                Українська
              </option>
            </select>

            <h2>{t("settingsHeader2")}</h2>
            <div>
              <Link to="/help">{t("SettingsLink1")} &rarr;</Link>
            </div>
          </div>
        </div>
    )
}