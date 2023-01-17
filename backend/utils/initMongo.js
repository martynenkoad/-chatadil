const mongoose = require("mongoose")

const initMongo = (app, done) => {
    
    const mongoUri = process.env.MONGO_URI
    mongoose.Promise = global.Promise

    mongoose.connect(mongoUri, { useUnifiedTopology: true })
      .then(() => {
        console.log(`Connected to ${mongoUri} :)`)
        if(done) {
            done()
        }
      })
      .catch(error => console.log(`Connection failed; [error: ${error.message}]`))
}

module.exports = initMongo