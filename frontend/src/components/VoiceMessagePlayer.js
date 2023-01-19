import React, { useState, useRef } from "react"
import { timeFunctions } from "../utils/transformTime" 

export default function VoiceMessagePlayer({ audioSrc }) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [currTime, setCurrTime] = useState("00:00")
    const [progress, setProgress] = useState(0)

    const audioRef = useRef()

    const toggle = () => { 
        setIsPlaying(!isPlaying)

        if(!isPlaying) {
            audioRef.current.play()
        }
        else {
            audioRef.current.pause()
        }
    }


    const handlePlay = () => {
        const currentTime = audioRef.current.currentTime
        const duration = audioRef.current.duration

        setCurrTime(timeFunctions.transformSeconds(currentTime))
        setProgress(currentTime * 100 / audioSrc.duration)

        if(duration === currentTime) {
            setIsPlaying(false)
            setProgress(100)
        }
    }

    return (
        <div className="voice-message-player">
            <audio
              src={audioSrc.url}
              ref={audioRef}
              onTimeUpdate={handlePlay}
            />
            <span 
              onClick={toggle}
              className="material-symbols-outlined play"
            >
                { isPlaying ? "pause_circle" : "play_circle" }
            </span>
            <div className="duration">
                <span className="">{currTime}</span>
                <div className="duration-bar">
                    <span
                      style={{ width: `${progress}%` }}
                    >  </span>
                </div>
                <span className="">{timeFunctions.transformSeconds(audioSrc.duration)}</span>
            </div>
        </div>
    )
}  