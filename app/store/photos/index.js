import lodash from 'lodash'
import {getField, updateField} from "vuex-map-fields"

export const namespaced = true

export const state = () => ({
    items: {
        docs: [],
    },
})

export const mutations = {
    updateField,
    add(state, item) {
        state.items.docs.push(item)
    },
    addFirst(state, item) {
        state.items.docs.splice(0, 0, item)
    },
    addAll(state, items) {
        state.items.docs = items
    },
    edit(state, item) {
        const index = lodash.findIndex(state.items.docs, {_id: item._id})
        state.items.docs.splice(index, 1, item)
    },
    remove(state, item) {
        const index = lodash.findIndex(state.items.docs, {_id: item._id})
        state.items.docs.splice(index, 1)
    },
    approve(state, photo) {
        const index = lodash.findIndex(state.items.docs, {_id: photo._id})
        state.items.docs[index].approved = true
    },
    unapprove(state, photo) {
        const index = lodash.findIndex(state.items.docs, {_id: photo._id})
        state.items.docs[index].approved = false
    },
}

export const getters = {getField}
