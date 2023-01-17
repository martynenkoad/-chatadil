const detectLinks = (string) => {
    const linkDetector = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g
    return string.replace(linkDetector, (link) => {
        return `<a href="${link}">${link}</a>`
    })
}


export default detectLinks