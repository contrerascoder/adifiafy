<template>
  <v-data-table
    :sort-by="['createdAt']"
    :sort-desc="[true]"
    :items="_pleitos"
    :headers="headers"
  >
    <template
      v-if="!$route.query.id"
      v-slot:top
    >
      <div>
        <div class="pa-3 d-flex flex-row-reverse">
          <v-menu offset-y>
            <template v-slot:activator="{on}">
              <v-btn
                v-if="userData.rol === 'attorney'"
                v-on="on"
              >
                <v-icon> mdi-filter </v-icon> Filtrar
              </v-btn>
            </template>
            <v-list v-if="userData.rol === 'attorney'">
              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    v-if="userData.rol !== 'customer'"
                    :color="onlyMine ? 'success' : 'primary'"
                    @click="onlyMine = !onlyMine"
                  >
                    Ver solo mis pleitos
                  </v-btn>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <v-btn
                    :color="hideClosed ? 'success' : 'primary'"
                    @click="hideClosed = !hideClosed"
                  >
                    Ocultar pleitos cerrados
                  </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <span
            class="mr-4"
            style="display: inline-block;"
          >
            <v-menu
              offset-y
              class="mr-2"
            >
              <template v-slot:activator="{on}">
                <v-btn
                  v-if="userData.rol === 'attorney'"
                  v-on="on"
                > <v-icon> mdi-plus </v-icon> Añadir </v-btn>
              </template>
              <v-list v-if="userData.rol === 'attorney'">
                <v-list-item>
                  <v-list-item-title> <v-btn
                    text
                    to="/private/addattornier"
                  > Abogado</v-btn></v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title> <v-btn
                    text
                    to="/private/addpleito"
                  >Pleito</v-btn></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </div>
    </template>
    <template
      v-if="userData && userData.rol === 'attorney'"
      v-slot:item.operations="{item}"
    >
      <nuxt-link
        style="text-decoration: none;"
        :to="'/private/pleito?id=' + item._id"
      >
        <span><v-icon> mdi-arrow-right-circle {{ item }}</v-icon></span>
      </nuxt-link>
    </template>
    <template v-slot:item.createdAt="{item}">
      <span>{{ item.createdAt | dateFromNow }} (<strong>{{ item.createdAt | standardDate }}</strong>)</span>
    </template>
    <template v-slot:item.description="{item}">
      <span>{{ item.description }} <strong v-if="item.closed">(este pleito esta cerrado)</strong></span>
    </template>
    <template v-slot:item.attorney="{item}">
      <span>{{ item.attorney.name }} {{ item.attorney.surname }}</span>
    </template>
    <template v-slot:item.dniuser="{item}">
      <nuxt-link :to="'/private/client?id=' + item.user._id">
        <span> {{ item.user.dni }}</span>
      </nuxt-link>
    </template>
  </v-data-table>
</template>
<script>
import {mapState, mapMutations} from "vuex"
export default {
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            onlyMine: false,
            hideClosed: true,
        }
    },
    async mounted() {
        this.addPleitos(this.items)
    },
    computed: {
        ...mapState(`pleitos`, {
            pleitos: `items`,
        }),
        headers() {
            const headers = [
                {sortable: false, text: `Descripcion`, value: `description`},
                {sortable: false, text: `Creado el`, value: `createdAt`, width: `17%`},
                {sortable: false, text: `Encargado`, value: `attorney`, width: `17%`},
            ]
            const user = this.userData
            if (user && user.rol === `attorney`) {
                headers.push({sortable: false, text: `Detalle`, value: `operations`, width: `1%`})
                if (this.$route.name !== `index-client-id`) {
                    headers.splice(0, 0, {sortable: false, text: `Cliente`, value: `dniuser`, width: `1%`})
                }
            }
            return headers
        },
        _pleitos() {
            const self = this
            return this.pleitos.filter((pleito) => {
                if (self.onlyMine) {
                    const isMine = pleito.attorney.email === self.userData.email
                    if (!isMine) return false
                }
                if (self.hideClosed) {
                    const isClosed = pleito.closed
                    if (isClosed) return false
                }
                return true
            })
        },
    },
    methods: {
        ...mapMutations(`pleitos`, [`addPleitos`, `addPleito`]),
    },
}
</script>
