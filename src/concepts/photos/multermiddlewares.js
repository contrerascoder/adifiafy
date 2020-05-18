import multer from 'multer'

const upload = multer({dest: `/tmp`})

export const photoMiddleware = upload.single(`photo`)
