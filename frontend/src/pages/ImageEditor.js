import React, { useState, useRef, useEffect } from "react"
import ImageEditorToolbar from "../components/ImageEditorToolbar"
import ImageCropper from "../components/ImageCropper"
import convertDataUriToBlob from "../utils/dataTransformations"
import { useTranslation } from "react-i18next"
import genRandomFileName from "../utils/genRandomFileName"

export default function ImageEditor({ image, setIsImageOpened, setImages, setPreviewImages, imageId, images, previewImages }) {

    const { t } = useTranslation()
    const canvasRef = useRef(null)

    const INIT_FILTERS = {
        brightness: 100,
        saturation: 100,
        blur: 0,
        inversion: 0,
        sepia: 0,
        grayscale: 0
    }

    const [filters, setFilters] = useState(INIT_FILTERS)
    const [filtersAreChanged, setFiltersAreChanged] = useState(false)
    const [openTool, setOpenTool] = useState("tunes")
    const [canvasWidth, setCanvasWidth] = useState(image.width)
    const [canvasHeight, setCanvasHeight] = useState(image.height)

    const [imageSrc, setImageSrc] = useState(image.src)
    const [output, setOutput] = useState(null)

    const reset = () => {  
        setFilters(INIT_FILTERS)
        setOutput(image.src)
        setCanvasHeight(image.height)
        setCanvasWidth(image.width)
        setFiltersAreChanged(false)
    }

    const renderImage = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        const newImage = new Image()
        newImage.src = output || image.src

        context.filter = generateFilter()
        newImage.onload = () => {
            context.drawImage(newImage, 0, 0, newImage.width, newImage.height,
                0, 0, canvas.width || 400, canvas.height || 400)
        }
    }

    const generateFilter = () => {
        return `brightness(${filters.brightness}%) saturate(${filters.saturation}%) blur(${filters.blur}px) invert(${filters.inversion}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`
    }

    useEffect(() => {
        if(openTool === "crop") {
            setFilters(INIT_FILTERS)
        }
    }, [openTool])

    useEffect(() => {
        if(openTool === "tunes") {
            renderImage()
        }
    }, [filters, openTool])

     
     const handleOpenCrop = () => {
        const canvas = canvasRef.current
        const baseImage = canvas.toDataURL("image/png", 1)
        setOutput(baseImage)
        setOpenTool("crop")
     }

     const saveChanges = () => {
        if(filtersAreChanged) {   
            const canvas = canvasRef.current
            const baseImage = canvas.toDataURL("image/png", 1)
            setOutput(baseImage)
        }
        if(output !== imageSrc || filtersAreChanged) {
            let newBlob = convertDataUriToBlob(output)
            const blobUrl = URL.createObjectURL(newBlob)
            const newFileName = genRandomFileName("png")
            let newImage = new File([newBlob], newFileName)

            let newImages = [...images]
            let newPreviewImages = [...previewImages]

            newImages[imageId] = newImage
            newPreviewImages[imageId] = { src: blobUrl, width: canvasWidth, height: canvasHeight }

            setImages(newImages)
            setPreviewImages(newPreviewImages)

            setIsImageOpened(false)
        } else {
            setIsImageOpened(false)
        }
      }

      
    
    return (
        <div className="image-editor">

            <div className="image-editor-header">
                <span 
                  className="material-symbols-outlined close"
                  onClick={() => setIsImageOpened(false)}
                >
                    close
                </span>
                <span
                  className="reset-btn"
                  onClick={saveChanges}
                >
                    {t("applyBtn")}
                </span>
                <span 
                  className="reset-btn"
                  onClick={reset}
                >{t("resetBtn")}</span>
            </div>

            <div className="image-section">
                {
                    openTool !== "crop" && openTool === "tunes" &&
                    <canvas className="canvas"  ref={canvasRef} width={canvasWidth} height={canvasHeight}>
                    </canvas>
                }
            </div>

            {
                openTool === "tunes" &&
                <ImageEditorToolbar 
                  filters={filters} 
                  setFilters={setFilters} 
                  setFiltersAreChanged={setFiltersAreChanged}
                />
            }

            {
                openTool === "crop" &&
                <>
                  <ImageCropper 
                    output={output}
                    setOutput={setOutput}
                    imageSrc={imageSrc}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    setCanvasHeight={setCanvasHeight}
                    setCanvasWidth={setCanvasWidth}
                  />
                </>
            }
            
            
            <div className="image-editor-footer">
                <div className="tool" onClick={() => handleOpenCrop()}>
                    <span 
                      className="material-symbols-outlined"
                      id="crop"
                    >
                        crop
                    </span>
                    <label htmlFor="crop">{t("cropImage")}</label>
                </div>

                <div className="tool" onClick={() => setOpenTool("tunes")}>
                    <span 
                      className="material-symbols-outlined"
                      id="tune"
                    >
                        tune
                    </span>
                    <label htmlFor="tune">{t("editImage")}</label>
                </div>
            </div>
        </div>
    )
}