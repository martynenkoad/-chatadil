import React from "react"
import fileDownload from "js-file-download"
import axios from "axios"
import genRandomFileName from "../utils/genRandomFileName"

export default function SingleImageComponent({ image, setIsImageOpened }) {

    const handleDownload = async () => {
        axios.get(image.url, {
            responseType: "blob"
        })
        .then((res) => {
            const fileName = genRandomFileName("png")
            fileDownload(res.data, fileName)
        })
    }

    return (
        <div className="fullscreen-image-container">
            <div className="fullscreen-image-header">
                <span onClick={() => setIsImageOpened(false)}>x</span>
                <span className="material-symbols-outlined" onClick={handleDownload}>
                    download
                </span>
            </div>
            <img 
              className="fullscreen-image"
              src={image.url}
              alt=""
            />
        </div>
    )
}  