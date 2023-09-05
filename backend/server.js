const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
//config

dotenv.config({ path: 'backend/config/config.env' })

// connectiing to database
connectDB()
app.listen(process.env.PORT, () => {
    console.log(`server is listening at Port ${process.env.PORT}`)
})