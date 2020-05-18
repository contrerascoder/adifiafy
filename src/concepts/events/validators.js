import {createValidator} from "../../helpers/createValidator"
import {check} from 'express-validator'

export const validator = createValidator([
    check(`title`).isLength({min: 6}).withMessage(`Ese titulo no es valido`),
    check(`body`).isLength({min: 10}).withMessage(`Esa descripción no es valida`),
    check(`place`).isLength({min: 10}).withMessage(`Ese lugar no es valido`),
    check(`date`).isLength({min: 1}).withMessage(`Esa fecha no es valida`),
    check(`time`).isLength({min: 1}).withMessage(`Esa hora no es valida`),
])
