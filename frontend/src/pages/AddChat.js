import React, { useState } from "react"
import CreateChat from "../components/CreateChat"
import CreateGroupChat from "../components/CreateGroupChat"
import Navbar from "../components/Navbar"
import { useTranslation } from "react-i18next"

export default function AddChat() {
 
  const [option, setOption] = useState("create-chat")
  const { t } = useTranslation()

  return (
      <>
          <Navbar />
          <div className="add-chat">
                <div className="add-chat-actions">
                  <h2>{t("optionsHeader")}</h2>
                    <div onClick={() => setOption("create-chat")}>
                      <span className="material-symbols-outlined">
                        person
                      </span>
                      {t("createChat")}
                    </div>
                    <div onClick={() => setOption("create-group-chat")}>
                      <span className="material-symbols-outlined">
                        group
                      </span>
                      {t("createGroupChat")}
                    </div>
                    <div onClick={() => setOption("create-channel")}>
                      <span className="material-symbols-outlined">
                        record_voice_over
                      </span>
                      {t("createChannel")}
                    </div>
                </div>
                {
                  option === "create-chat" && <CreateChat />
                }
                {
                  option === "create-group-chat" && <CreateGroupChat isChannel={false} />
                } 
                {
                  option === "create-channel" && <CreateGroupChat isChannel={true} />
                }
        </div>
      </>            
  )
}