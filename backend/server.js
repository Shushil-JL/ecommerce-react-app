const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./config/database')

// handling uncaught exception
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down server due to uncaught Exception")
    process.exit(1)
})


//config

dotenv.config({ path: 'backend/config/config.env' })

// connectiing to database
connectDB()
const server = app.listen(process.env.PORT, () => {
    console.log(`server is listening at Port ${process.env.PORT}`)
})

// unhandled promise rejection 
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down server due to unhandled Promise Rejection")
    server.close(() => {
        process.exit(1)
    })
})