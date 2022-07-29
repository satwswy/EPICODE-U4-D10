import { getMedias, writeMedias } from "../fs/tools.js"
import uniqid from 'uniqid'
import createHttpError from "http-errors"

export const saveNewMedia = async newMediaData => {
    const medias = await getMedias()
    const newMedia = {...newMediaData, createdAt: new Date(),
    id: uniqid()}
    medias.push(newMedia)
    await writeMedias(medias)

    return newMedia.id
}

export const findMedias = async () => getMedias()

export const findMediaById = async mediaId => {
    const medias = await getMedias()

    const foundMedia = medias.find(media => media.id === mediaId)

    return foundMedia
}

export const findMediaByIdAndUpdate = async (mediaId, updates) => {
    const medias = await getMedias()
    const index = medias.findIndex(media => media.id === mediaId)
    if(index !== -1){
        medias[index] = {...medias[index], ...updates, updatedAt: new Date()}
        await writeMedias(medias)
        return medias[index]
    }  else {
        return null
    }
}

export const findMediaByIdAndDelete = async mediaId => {
    const medias = await getMedias()
    
    const remainingMedias = medias.filter(media => media.id !== mediaId)

    if(medias.length === remainingMedias.length) throw createHttpError(
        404, `Media with id ${mediaId} not found`
    )
    await writeMedias(remainingMedias)
}