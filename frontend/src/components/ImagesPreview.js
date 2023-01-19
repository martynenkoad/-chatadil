import React, { useState } from "react"
import ImageEditor from "../pages/ImageEditor"

export default function ImagesPreview({ previewImages, images, setImages, setPreviewImages }) {

    const [isImageOpened, setIsImageOpened] = useState(false)
    const [imageId, setImageId] = useState(null)
    const [imageToOpen, setImageToOpen] = useState(null)

    const removeImage = (id) => {
      const newImages = [...images]
      const newPreviewImages = [...previewImages]

      newImages.splice(id, 1)
      newPreviewImages.splice(id, 1)

      setImages(newImages)
      setPreviewImages(newPreviewImages)
    }

    const openImage = (img, index) => {
        setIsImageOpened(true)
        setImageId(index)
        setImageToOpen(img)

    }
 
    return (
        <div className="images-preview-container">
            {
                previewImages.map((image, index) => {
                    return (
                        
                        <div className="image-container" key={index}>
                          <img 
                            className="image-preview"
                            src={image.src}
                            alt=""
                            onClick={() => openImage(image, index)}
                          />
                          <span 
                            className="material-symbols-outlined close"
                            onClick={() => {removeImage(index)}}
                          >
                            close
                          </span>
                        </div>
                    )
                })
            }
            {
                isImageOpened &&
                <ImageEditor
                  image={imageToOpen}
                  imageId = {imageId}
                  setIsImageOpened={setIsImageOpened}
                  setImages={setImages}
                  setPreviewImages={setPreviewImages}
                  images={images}
                  previewImages={previewImages}
                />
            }
        </div>
    )
} 