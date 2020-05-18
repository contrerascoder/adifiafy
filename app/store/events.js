import lodash from 'lodash'
import {getField, updateField} from "vuex-map-fields"

export const namespaced = true

export const state = () => ({
    items: [],
})

export const mutations = {
    updateField,
    add(state, item) {
        state.items.push(item)
    },
    edit(state, item) {
        const index = lodash.findIndex(state.items, {_id: item._id})
        state.items.splice(index, 1, item)
    },
}

export const getters = {getField}
