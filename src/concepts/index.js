import express from 'express'
import AuthController from './auth/AuthController'
import CustomError from './errors/CustomError'
import UsersService from './auth/UsersService'
import UserController from './users/UserController'
import EventController from './events/EventController'
import ProfileController from './auth/profiles/ProfileController'
import PhotoController from './photos/PhotoController'
import ArticleController from './articles/ArticleController'
import TagController from './tags/TagController'

const users = new UsersService()

export const conceptsRouter = new express.Router()

conceptsRouter.use(`/auth`, new AuthController().router)
conceptsRouter.use(`/users`, new UserController().router)
conceptsRouter.use(`/events`, new EventController().router)
conceptsRouter.use(`/profile`, new ProfileController().router)
conceptsRouter.use(`/photos`, new PhotoController().router)
conceptsRouter.use(`/articles`, new ArticleController().router)
conceptsRouter.use(`/tags`, new TagController().router)

conceptsRouter.get(`/need-setup`, async (req, res) => {
    const attorniers = await users.searchAttorniers()
    return res.status(200).end(attorniers.length === 0 ? `T` : `F`)
})

conceptsRouter.use((err, req, res, next) => {
    const data = {
        message: `Ocurrió un error: ${err.message}`,
    }
    data.err = err instanceof CustomError ? err : {},
    res.status(400).json(data)
})
