import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
    createPersistedState({
        key: `adifia`,
        paths: [`auth`],
    })(store)
}
