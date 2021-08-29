import express from 'express'
import APP from './services/ExpressApp'
import dbConnection from './services/Database'

const StartServer = async () => {
    const app = express()
    await dbConnection()
    await APP(app)

    app.listen((8000), () => {
        console.log("App is Listing to Port 8000")
    })

}
StartServer()