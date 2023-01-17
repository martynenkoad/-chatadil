import React, { useState, useRef } from "react"
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import 'react-image-crop/src/ReactCrop.scss'
import { useTranslation } from "react-i18next"

export default function ImageCropper({ output, imageSrc, setOutput, setCanvasHeight, setCanvasWidth, canvasWidth, canvasHeight }) {

    const { t } = useTranslation()

    const imgRef = useRef()

    const [crop, setCrop] = useState({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,   
        y: 25
    })
    const [aspect, setAspect] = useState(1 / 1)

    const onImageLoad = (e) => {

        // maybe create newWidth, newHeight etc
        let { width, height } = imgRef.current

        if(width > 400) {
            width = 400
            imgRef.current.width = 400
        } else if (height > 400) {
            height = 400
            imgRef.current.height = 400
        }

        const crop = centerCrop(
            makeAspectCrop({
                unit: "%", // MAYBE PX????
                width: 100
            },
              aspect,
              width, 
              height
            ),
            width,
            height
        )

        setCrop(crop)
     }

    //  makeAspectCrop

     const toggleAspect = () => {
        if(aspect){ setAspect(undefined) }
        else {
            setAspect(1 / 1)
            setCrop({
                unit: "%",
                width: 50,
                height: 50,
                x: 25, 
                y: 25
            })
        }
     }

     const getCroppedImage = () => {
        const canvas = document.createElement("canvas")
    
        let img = new Image()
        img.src = output ? output : imageSrc

        console.log("img.naturalHeight", img.naturalHeight)
        console.log("img.naturalWidth", img.naturalWidth)
        console.log("img.width:", img.width)
        console.log("img.height:", img.height)

        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height

        canvas.width = crop.width
        canvas.height = crop.height

        const context = canvas.getContext("2d")

        const pixelRatio = window.devicePixelRatio
        canvas.width = crop.width * pixelRatio
        canvas.height = crop.height * pixelRatio
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        context.imageSmoothingQuality = "high"

        context.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        setCanvasWidth(crop.width)
        setCanvasHeight(crop.height)

        const baseImage = canvas.toDataURL("image/png", 1)
        setOutput(baseImage)
     }


    return (
        <>
        <ReactCrop
            // style={{ maxWidth: "50%", maxHeight: "50%" }}
            crop={crop}
            aspect={aspect}
            ruleOfThirds
            onChange={(crop, percentCrop) => setCrop(crop)}
        >
            <img
              src={output || imageSrc}
              alt=""
              onLoad={onImageLoad}
              ref={imgRef}
            />
            </ReactCrop>
            <span onClick={toggleAspect}>{t("toggleAspect")}</span>
            <span onClick={getCroppedImage}>{t("crop")}</span>
        </>
    )
}