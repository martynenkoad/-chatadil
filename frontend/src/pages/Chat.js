import React from "react"
import Sidebar from "../components/Sidebar"
import Message from "../components/Message"
import Navbar from "../components/Navbar"

export default function Chat() {
    return (
        <>
            <Navbar />
            
            <div className="chat-page">
                <Sidebar />
                <Message /> 
            </div>
        </>
         
    )
}