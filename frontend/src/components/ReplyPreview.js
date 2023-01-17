import React from "react"

export default function ReplyPreview({ replyMessage, setReplyMessage }) {
    
    return (
        <div className="reply-preview-container">
            <div className="reply-preview">
                <span className="material-symbols-outlined style-section">
                    reply
                </span>

                <div className="message-section">
                    <p className="username">{replyMessage.from.username}</p>
                    <a href={`#${replyMessage._id}`} className="content">
                    {replyMessage.content && replyMessage.content}
                    {
                        !replyMessage.content && replyMessage.images.length && !replyMessage.voiceMessage.public_id &&
                        "A message"
                    }
                    {
                        (!replyMessage.content && replyMessage.voiceMessage.public_id) &&
                        "A voice message" 
                    }
                    </a>
                </div>
            </div>

            <span 
              className="material-symbols-outlined close"
              onClick={() => setReplyMessage(null)}
            >
                close
            </span>
            
        </div>
    )
}