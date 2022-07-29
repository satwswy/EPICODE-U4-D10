import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mediasRouter from "./api/medias/index.js"
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandlers.js"

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())


server.use("/medias", mediasRouter)



server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)



server.listen(port, ()=>{
    console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
})