import React from "react"

export default function ForwardPreview({ forwardMessage, setForwardMessage }) {
    return (
        <div className="reply-preview-container">
            <div className="reply-preview">
                <span className="material-symbols-outlined style-section">
                    forward
                </span>

                <div className="message-section">
                    <p className="username">{forwardMessage.from.username}</p>
                    <div className="content">
                    {forwardMessage.content && forwardMessage.content}
                    {
                        !forwardMessage.content && forwardMessage.images.length && !forwardMessage.voiceMessage.public_id &&
                        "A message"
                    }
                    {
                        (!forwardMessage.content && forwardMessage.voiceMessage.public_id) &&
                        "A voice message" 
                    }
                    </div>
                </div>
            </div>

            <span 
              className="material-symbols-outlined close"
              onClick={() => setForwardMessage(null)}
            >
                close
            </span>
            
        </div>
    )
}