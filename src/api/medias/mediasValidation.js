import { checkSchema , validationResult } from "express-validator"
import createHttpError from "http-errors"

const mediasSchema = {
    title: {
        isString: {
            errorMessage: "title field cannot be empty",
        },
    },
    year:{
        isString: {
            errorMessage: "description field cannot be empty",
        },
    },
    type: {
        isString: {
            errorMessage: "type field cannot be empty",
        },
    },

}

const mediasUpdateSchema = {
    title: {
        isString: {
            errorMessage: "title field must be string",
        },
        optional: true
    },
    year:{
        isString: {
            errorMessage: "description field must be string",
        },
        optional: true
    },
    type: {
        isString: {
            errorMessage: "type field must be string",
        },
        optional: true
    },

}

export const checksMediasSchema = checkSchema(mediasSchema)
export const checksMediasUpdateSchema = checkSchema(mediasUpdateSchema)

export const checkValidationResult = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        next(createHttpError(400, `Product validation error`, {errorsList: errors.array()}))
    } else {
        next()
    }
}