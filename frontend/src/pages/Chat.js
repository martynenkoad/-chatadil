import React, { useEffect, useCallback, useState } from "react"
import Sidebar from "../components/Sidebar"
import Message from "../components/Message"
import Navbar from "../components/Navbar"

export default function Chat() {

    // max window.innerWidth when everything OK: 714
    const [showCloseSidebar, setShowCloseSidebar] = useState(window.innerWidth <= 720)
    const [showSidebar, setShowSidebar] = useState(true)

    const handleResize = useCallback(() => {
        if(window.innerWidth <= 720) {
            setShowCloseSidebar(true)
        } else {
            setShowCloseSidebar(false)
        }
    }, [showCloseSidebar, window.innerWidth])    

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [handleResize])
    

    return (
        <>
            <Navbar />
            
            <div className="chat-page">
                <Sidebar 
                  showCloseSidebar={showCloseSidebar} 
                  setShowCloseSidebar={setShowCloseSidebar}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                />
                <Message 
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                /> 
            </div>
        </>
         
    )
}