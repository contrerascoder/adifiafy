import {getField, updateField} from 'vuex-map-fields'

export const state = () => ({
    token: null,
    userData: null,
    expirement: null,
})

export const getters = {getField, isLogged, userLinks}
export const mutations = {updateField, logout, addProfile}

/**
 * Añadir perfiles
 * @param {*} state
 * @param {*} profile
 */
function addProfile(state, {name, profile}) {
    state.userData.profiles[name] = profile
}

/**
 * Borrar sesión del usuario
 * @param {*} state
 */
function logout(state) {
    state.token = null
    state.userData = null
}

/**
 * Ver si esta logueado el usuario
 * @param {*} state
 * @return {Boolean}
 */
function isLogged(state) {
    return state.token !== null
}

/**
 * Obtener lista de enlaces para el usuario
 * @param {*} param0
 * @return {Object}
 */
function userLinks({userData}) {
    if (!userData) {
        return null
    }
    const links = [
        {icon: `mdi-account`, title: `Pagina de perfil`, url: `/profile`},
    ]
    const {administrator} = userData.profiles
    if (administrator) {
        links.push({icon: `mdi-key`, title: `Area de administración`, url: `/admin`})
    }
    return links
}


