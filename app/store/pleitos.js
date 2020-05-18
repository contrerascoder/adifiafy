export const state = () => ({
    items: [],
})

export const mutations = {
    addPleito(state, pleito) {
        state.items.push(pleito)
    },
    addPleitos(state, pleitos) {
        state.items = pleitos
    },
}
