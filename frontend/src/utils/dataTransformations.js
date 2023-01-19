const convertDataUriToBlob = (dataUri) => {
    let byteString = atob(dataUri.split(",")[1])

    let mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0]

    let arrayBuffer = new ArrayBuffer(byteString.length)
    let intArray = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i)
    }

    let blob = new Blob([arrayBuffer], { type: mimeString })

    return blob 
}

export default convertDataUriToBlob