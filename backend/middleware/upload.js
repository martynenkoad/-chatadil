const busboy = require("busboy")
const cloudinary = require("../utils/cloudinary")
const streamifier = require("streamifier")
const fs = require("fs")

/**
 * @description    Get all fields & files from the req.
 * @param req      req must be a type of FormData.
 */
const getData = (req) => {
    return new Promise((resolve, reject) => {
        const form = busboy({ headers: req.headers })
        const files = []
        const fields = {}
        const buffers = {}

        form.on("field", (name, value) => {
            fields[name] = value
        })

        form.on("file", (fieldName, file, filename) => {

            const fileName = filename.filename
            buffers[fileName] = []

            file.on("data", (data) => {
                buffers[fileName].push(data)
            })

            file.on("end", () => {
                files.push({ 
                    fileBuffer: Buffer.concat(buffers[fileName]),
                    fieldName,
                    fileName
                })
            })
        })

        form.on("finish", () => resolve({ files, fields }))

        form.on("error", (error) => reject(error))

        req.pipe(form)
    })
}

/**
 * @description    Uploads images to Cloudinary.
 * @param files    optional: files to upload.
 */
const uploadImages = async (files) => {
    if(files.length === 0) return

    return new Promise((resolve, reject) => {
        let queue = files.length
        const uploaded = []

        for (let file of files) {
            const uploadViaStream = cloudinary.uploader.upload_stream({
                folder: process.env.CLOUD_FOLDER,
                width: 200, // MAYBE DELETE LATER
                height: 200, // MAYBE DELETE LATER
                crop: "fill" // MAYBE DELETE LATER
            }, (error, result) => {
                queue--

                if(!error) {
                    uploaded.push({
                        public_id: result.public_id,
                        url: result.url
                    })
                }

                if(!queue) {
                    resolve(uploaded)
                }
            })
            streamifier.createReadStream(file.fileBuffer).pipe(uploadViaStream)
        }
    })
}

/**
 * @description            Uploads audio to temporary location and then - to Cloudinary.
 * @param originalname     A name for the file.
 * @param buffer
 */
const uploadAudio = async (originalname, buffer) => {

    let uploadLoc = __dirname + "/uploads/" + originalname
    fs.writeFileSync(uploadLoc, Buffer.from(new Uint8Array(buffer)))

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            uploadLoc,
            {
                resource_type: "video",
                folder: process.env.CLOUD_FOLDER,
                overwrite: true
            },
            (error, result) => {
                if (error) reject(error)
                else {
                    fs.unlink(uploadLoc, (error) => {
                        if (error) reject(error)
                    })
    
                    const uploaded = {
                        public_id: result.public_id,
                        url: result.url,
                        duration: result.duration
                    }
                    resolve(uploaded)
                }
            }
        )
    })
}

module.exports = {
    getData,
    uploadImages,
    uploadAudio
}

