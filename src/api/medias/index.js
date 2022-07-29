import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { findMediaById, findMediaByIdAndDelete, findMediaByIdAndUpdate, findMedias, saveNewMedia } from "../../lib/db/medias.js"
import { checksMediasSchema, checksMediasUpdateSchema, checkValidationResult } from "./mediasValidation.js"
import {extname} from 'path'
import { getMedias, saveMediasImages } from "../../lib/fs/tools.js"
import { getPDFReadableStream } from "../../lib/fs/pdf-tools.js"
import {pipeline} from "stream"
const mediasRouter = express.Router()

mediasRouter.post("/", checksMediasSchema, checkValidationResult, async(req,res,next)=>{
    try {
        const id = await saveNewMedia(req.body)
        res.status(201).send({id})
    } catch (error) {
        next(error)
    }
})

mediasRouter.get("/", async(req,res,next)=>{
    try {
        const medias = await findMedias()
        res.send(medias)
    } catch (error) {
        next(error)
    }
})

mediasRouter.get("/:mediaId", async(req,res,next)=>{
    try {
    const media =   await  findMediaById(req.params.mediaId)
   if(media) {
    res.send(media)
   } else {
    next(createHttpError(404, `Media with id ${req.params.mediaId} not found`))
   }
} catch (error) {
        next(error)
    }
})

mediasRouter.put("/:mediaId", checksMediasUpdateSchema, checkValidationResult, async(req,res,next)=>{
    try {
        const media =   await  findMediaByIdAndUpdate(req.params.mediaId, req.body)
   if(media) {
    res.send(media)
   } else {
    next(createHttpError(404, `Media with id ${req.params.mediaId} not found`))
   }
    } catch (error) {
        next(error)
    }
})

mediasRouter.delete("/:mediaId", async(req,res,next)=>{
    try {

        
        await findMediaByIdAndDelete(req.params.mediaId)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

mediasRouter.patch("/:mediaId/image", multer().single("mediaPicture"), async (req,res,next)=>{
    try {
        const fileName = req.params.mediaId + extname(req.file.originalname)
        

       const media =  await findMediaByIdAndUpdate(req.params.mediaId, {imageUrl: "/img/products/" + fileName})
       if(media){
        await saveMediasImages(fileName, req.file.buffer)
        res.send()
       }
       else{
        next(createHttpError(404, `Media with id ${req.params.mediaId} not found`))
       }
    } catch (error) {
        next(error)
    }
})

mediasRouter.get("/new/PDF", async (req, res, next)=>{
    try {
      const mediasList = await getMedias()
      res.setHeader("Content-Disposition", "attachment; filename=medias.pdf")
      const source = getPDFReadableStream(mediasList)
      const destination = res
      pipeline(source, destination, err => {
        if(err) console.log(err)
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  })

export default mediasRouter