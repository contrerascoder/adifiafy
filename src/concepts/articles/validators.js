import {createValidator} from "../../helpers/createValidator"
import {check} from "express-validator"
export const articleValidator = createValidator([
    check(`title`).isLength(6).withMessage(`El titulo es muy corto`),
    check(`body`).custom((item) => item !== null).withMessage(`Es necesario poner algo de contenido`),
    check(`category`).isLength(6).withMessage(`La categoría es muy corta`),
    check(`tags`).custom((item) => item && item.length > 0).withMessage(`Al menos una etiqueta es requerida`),
])
