import React from "react"
import me from "../assets/me.png"
import dmitry from "../assets/dmitry.png"
import guy from "../assets/guy.png"
import sheldon from "../assets/sheldon.png"
import conversation from "../assets/conversation.png"
import Navbar from "../components/Navbar"

import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export default function Home() {
    const { t } = useTranslation()

    return (
        <div className="home">
            <Navbar />
            <div className="home-section">
                <div>
                    <h1>{t("greeting")}</h1>
                    <p>{t("homeText1")}</p>
                    <p>{t("homeText2")}</p>

                    <Link to="/chat" className="follow-btn">{t("homeButton")} &rarr;</Link>
                </div>
                <div>
                    <img 
                      src={conversation}
                      alt=""
                    />
                </div>
            </div>

            <div className="team-container">
                <div className="team-header">
                    <h2>{t("teamHeader")}</h2>
                    <p>{t("contactText")} <a href="https://www.instagram.com/nastyaemo4">{t("contactLink")}</a></p>
                </div>
                <div className="team">
                    <div>
                        <img 
                          src={dmitry}
                          alt=""
                        />
                        <h4>{t("dmitry")}</h4>
                        <p>{t("dmitryPosition")}</p>
                    </div>
                    <div>
                        <img 
                          src={guy}
                          alt=""
                        />
                        <h4>{t("thisGuy")}</h4>
                        <p>{t("thisGuyPosition")}</p>
                    </div>
                    <div>
                        <img 
                          src={sheldon}
                          alt=""
                        />
                        <h4>{t("sheldon")}</h4>
                        <p>{t("sheldonPosition")}</p>
                    </div>
                    <div>
                        <img 
                          src={me}
                          alt=""
                        />
                        <h4>{t("me")}</h4>
                        <p>{t("mePosition")}</p>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p>© Copyright Chatadil 2022. All Rights Reserved.</p>
            </div>
        </div>
    )
} 