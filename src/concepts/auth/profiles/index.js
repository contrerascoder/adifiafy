import AdminProfileModel from "./adminer"
import PhotographerProfileModel from "./photographer"
import AuthorProfileModel from "./author"

/**
 * Conseguir todos los perfiles para un usuario
 * @param {*} userId
 */
export default async function getAllProfilesOf(userId) {
    return {
        administrator: await AdminProfileModel.findOne({user: userId}),
        author: await new AuthorProfileModel().model.findOne({user: userId}),
        photographer: await new PhotographerProfileModel().model.findOne({user: userId, year: new Date().getFullYear()}),
    }
}
