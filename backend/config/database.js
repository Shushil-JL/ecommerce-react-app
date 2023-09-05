const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((con) => {
            console.log(`Database connected ${con.connection.host}`)
        }).catch((err) => {
            console.log(err)
        })
}

module.exports = connectDB