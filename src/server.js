import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mediasRouter from "./api/medias/index.js"
import createHttpError from "http-errors"
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandlers.js"
import swagger from 'swagger-ui-express'
import yaml from "yamljs"
import {join} from "path"


const server = express()
const port = process.env.PORT || 3001
const yamlFile = yaml.load(join(process.cwd(), "./src/docs/epicMediasDefinitions.yml"))

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

server.use(cors({origin: (origin, corsNext)=>{
    console.log("ORIGIN: ", origin)
    if (!origin || whitelist.indexOf(origin)!== -1){
        corsNext(null, true)
    } else {
        corsNext(createHttpError(400, `Cors Error! Your origin${origin} is not in the list`))
    }
}}))
server.use(express.json())


server.use("/medias", mediasRouter)
server.use("/new/docs", swagger.serve, swagger.setup(yamlFile))



server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)



server.listen(port, ()=>{
    console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
})