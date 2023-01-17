import React from "react"

export default function IsTyping({ username }) {
    return (
        <div className="is-typing">
            <span className="text">{username} is typing</span>
            <span className="anime">.</span>
            <span className="anime">.</span>
            <span className="anime">.</span>
        </div>
    )
}