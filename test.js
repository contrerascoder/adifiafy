import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: {type: String},
    surname: {type: String},
    email: {type: String},
})

const model = mongoose.model(`user`, schema)

test()

/**
 * sdsdsds
 */
async function test() {
    const user = await model.findOne()
    console.log(user.age)
    console.log(user)
}
