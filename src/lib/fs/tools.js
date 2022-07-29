import fs from 'fs-extra'
import { dirname , join } from 'path'
import {fileURLToPath} from 'url'

const {readJSON , writeJSON} = fs

const mediasJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/medias.json")

export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = mediasArray => writeJSON(mediasJSONPath, mediasArray)
