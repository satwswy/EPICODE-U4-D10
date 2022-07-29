import fs from 'fs-extra'
import { dirname , join } from 'path'
import {fileURLToPath} from 'url'

const {readJSON , writeJSON, writeFile} = fs

const mediasJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/medias.json")
const publicMediasFolderPath = join(process.cwd(), "./public/img/medias")


export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = mediasArray => writeJSON(mediasJSONPath, mediasArray)


export const saveMediasImages = (fileName, file) => writeFile(join(publicMediasFolderPath, fileName), file)