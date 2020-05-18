<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="display2">
          Detalles del usuario
        </h3>
        <div>
          <v-breadcrumbs
            divider="/"
            :items="breads"
          />
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <h2 class="headline">
        {{ user.name }} {{ user.password }}
      </h2>
      <p class="font-weight-bold">
        Datos de contacto
      </p>
      <ul>
        <li>dni: {{ user.dni }}</li>
        <li>Telefono: {{ user.phone }}</li>
        <li>Correo: {{ user.email }}</li>
      </ul>
      <v-card outlined>
        <v-card-title primary-title>
          <div>
            <h3 class="display-2">
              Listado de perfles
            </h3>
          </div>
        </v-card-title>
        <v-card-text>
          <template v-if="countProfiles">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="item in profileList"
                  :key="item.profile"
                  :cols="4"
                >
                  <user-profile
                    v-if="!item.disabled"
                    :profile="item"
                    @delete-profile="deleteProfile"
                  />
                </v-col>
              </v-row>
            </v-container>
          </template>
          <p v-else>
            Este usuario no tiene registrado ningun perfil
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!isAuthor"
            text
            small
            color="primary"
            @click="makeAuthor"
          >
            Hacer autor
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import UserProfile from "./user-profile"
import lodash from 'lodash'
export default {
    components: {UserProfile},
    props: {
        user: {
            type: Object,
            default: null,
        },
        profiles: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            profileList: [],
            isAuthor: false,
            breads: [
                {disabled: false, text: `Listado de usuarios`, to: `/admin/users`, exact: true},
                {disabled: true, text: `Detalle de usuario`},
            ],
        }
    },
    computed: {
        countProfiles() {
            return this.profileList.filter((profile) => !profile.disabled).length
        },
    },
    mounted() {
        this.isAuthor = this.profiles[`author`] !== null && !this.profiles[`author`].disabled
        for (const profile in this.profiles) {
            if (this.profiles.hasOwnProperty(profile)) {
                const element = this.profiles[profile]
                if (element === null) continue
                this.profileList.push({
                    ...element,
                    name: profile,
                })
            }
        }
    },
    methods: {
        deleteProfile(r) {
            const index = lodash.findIndex(this.profileList, {_id: r._id})
            this.profileList.splice(index, 1)
            if (r.name === `author`) {
                this.isAuthor = false
            }
            this.notify(`error`, `El perfil fue eliminado`)
        },
        existProfile(profileName) {
            return this.profileList.filter((cProfile) => cProfile.name === profileName).length === 1
        },
        async makeAuthor() {
            try {
                const r = await this.axiosRequest({
                    url: `/profile/author/` + this.user._id,
                    method: `post`,
                })
                if (r.data.message) {
                    this.notify(`success`, r.data.message)
                    this.profileList.splice(lodash.findIndex(this.profiles, {name: `author`}), 1)
                    this.profileList.push({
                        ...r.data.profile,
                        name: `author`,
                    })
                } else {
                    this.notify(`success`, `El perfil se creo con exito`)
                    this.profileList.push({
                        ...r.data,
                        name: `author`,
                    })
                }
                this.isAuthor = true
            } catch (error) {

            }
        },
    },
}
</script>
