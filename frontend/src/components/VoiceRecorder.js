import React, { useState, useEffect } from "react"
import genRandomFileName from "../utils/genRandomFileName"
import { timeFunctions } from "../utils/transformTime" 
import { sendVoiceMessage } from "../redux/message/messageSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export default function VoiceRecorder({ chatid, socket, showInput, setShowInput }) {

    const dispatch = useDispatch()

    const INIT_STATE = {
        recordTime: {
            sec: 0,
            min: 0
        },
        isRecording: false,
        stream: null,
        mediaRecorder: null,
        audioBlob: null
    }

    const MAX_RECORD_TIME = {
        sec: 0,
        min: 2
    }

    const [recorder, setRecorder] = useState(INIT_STATE)

    const startRecording = async () => {
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            setRecorder(prevRecorder => {
                return {
                    ...prevRecorder,
                    isRecording: true,
                    stream: stream
                }
            })
            setShowInput(false)
        } catch (error) { 
            toast.error(error.message || error.toString())
         }
    }

    const upload = async () => {
        if (recorder.audioBlob && chatid) {
            const fileName = genRandomFileName("webm")
            let fd = new FormData()
            fd.append("voiceMessage", recorder.audioBlob, fileName)

            dispatch(sendVoiceMessage({ socket, chat: chatid, fd }))
        }
    }

    useEffect(() => {
        upload()
    }, [recorder.audioBlob])

    const saveRecording = async () => {
        if (recorder.mediaRecorder.state !== "inactive") recorder.mediaRecorder.stop()
        setRecorder(prevRecorder => {
            return {
                ...prevRecorder,
                isRecording: false
            }
        })

        setShowInput(true)
    }


    const getMediaRecorder = () => {
        if (recorder.stream) {
            setRecorder(prevRecorder => {
                return {
                    ...prevRecorder,
                    mediaRecorder: new MediaRecorder(prevRecorder.stream)
                }
            })
        }
    }

    const getAudio = () => {
        let chunks = []

        if (recorder.mediaRecorder && recorder.mediaRecorder.state === "inactive") {
            recorder.mediaRecorder.start()

            recorder.mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }

            recorder.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
                chunks = []

                setRecorder(prevRecorder => {
                    if (prevRecorder.mediaRecorder) {
                        return {
                            ...INIT_STATE,
                            audioBlob
                        }
                    } else {
                        return INIT_STATE
                    }
                })
            }

            return () => {
                if (recorder.mediaRecorder) recorder.mediaRecorder.stream.getAudioTracks().forEach(track => track.stop())
            }
        }
    }

    const cancelRecord = () => {
        setRecorder(INIT_STATE)
        setShowInput(true)
    }

    useEffect(() => {
        let interval

        if(recorder.isRecording) {
            interval = setInterval(() => {
                setRecorder(prevRecorder => {
                    if (prevRecorder.recordTime.min === MAX_RECORD_TIME.min && prevRecorder.recordTime.sec  === MAX_RECORD_TIME.sec) {
                        clearInterval(interval)
                    }

                    if (prevRecorder.recordTime.sec >= 0 && prevRecorder.recordTime.sec < 59) {
                        return {
                            ...prevRecorder,
                            recordTime : {
                                min: prevRecorder.recordTime.min,
                                sec: prevRecorder.recordTime.sec + 1
                            }
                        }
                    }

                    if (prevRecorder.recordTime.sec === 59) {
                        return {
                            ...prevRecorder,
                            recordTime : {
                                min: prevRecorder.recordTime.min + 1,
                                sec: 0
                            }
                        }
                    }
                })
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    })

    useEffect(() => {
        getMediaRecorder()
    }, [recorder.stream])

    useEffect(() => {
        getAudio()
    }, [recorder.mediaRecorder])

    
    return (
        <div className="voice-recorder">
                
            {
                !recorder.isRecording &&
                <span 
                  className="material-symbols-outlined"
                  onClick={startRecording}
                >
                    mic
                </span>
            }

            {
                recorder.isRecording &&
                
                <div className="message-input-container">
                    <div className="mic-working">
                        <div className="record-timer">
                            <span>{timeFunctions.transformTime(recorder.recordTime.min)} : </span>
                            <span>{timeFunctions.transformTime(recorder.recordTime.sec)}</span>
                        </div>
                        <div className="cancel" onClick={cancelRecord}>
                            Cancel
                        </div>
                        <span
                          className="material-symbols-outlined send"
                          onClick={saveRecording}
                        > 
                           send
                        </span>
                    </div>
                </div>
            }

        </div>
    )
} 