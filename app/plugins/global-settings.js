import Vue from 'vue'
import {mapFields} from 'vuex-map-fields'
import AppForm from '@/components/app-form.vue'
import RemoteData from '@/components/remote-data.vue'
import AuthedView from '@/components/authed-view'
import Redirect from '@/components/redirect'
import HasProfile from '@/components/other/has-profile'
import moment from 'moment'
import rules from './rules'
import {mapGetters, mapMutations} from 'vuex'

Vue.component(`app-form`, AppForm)
Vue.component(`remote-data`, RemoteData)
Vue.component(`authed-view`, AuthedView)
Vue.component(`redirect`, Redirect)
Vue.component(`has-profile`, HasProfile)

Vue.mixin({
    filters: {
        dateFromNow(value) {
            return moment(value).locale(`es`).fromNow()
        },
        standardDate(value) {
            return moment(value).locale(`es`).format(`DD/MM/YYYY HH:mm`)
        },
    },
    data() {
        return {fieldRules: rules}
    },
    computed: {
        ...mapFields(`auth`, [`token`, `userData`]),
        ...mapGetters(`auth`, [`isLogged`]),
    },
    mounted() {
        alertify.set(`notifier`, `position`, `top-center`) // eslint-disable-line
    },
    methods: {
        ...mapMutations(`auth`, [`logout`]),
        notify(color, message) {
            if ([`error`, `success`].indexOf(color) === -1) {
                throw new Error(`${color} no es valido para alertify`)
            }
            alertify[color](message) // eslint-disable-line
        },
        prompt: (question) => new Promise((resolve, reject) => {
            alertify.prompt(question, function(evt, value ) { // eslint-disable-line
                resolve(value)
            }, function() {
                reject(new Error(`Valor nulo`))
            }).set(`type`, `password`)
        }),
        axiosRequest(params) {
            const self = this
            const meta = document.querySelector(`meta[name="base-url"]`)
            const args = {
                baseURL: meta.content,
                ...params,
                headers: {},
            }
            if (self.token) {
                args.headers.Authorization = self.token
            }
            return self.$axios(args)
        },
    },
})
