const genRandomFileName = (extension) => {
    return `${new Date().getTime().toString()}--${Math.floor(Math.random() * 100000000)}.${extension}`
}

export default genRandomFileName