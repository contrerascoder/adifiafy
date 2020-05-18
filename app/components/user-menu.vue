<template>
  <v-menu
    v-model="menu"
    offset-y
  >
    <template v-slot:activator="{on}">
      <span
        icon
        style="display: flex; align-items: center; cursor: pointer;"
        v-on="on"
      >
        <img-gravatar
          :height="'30px'"
          :email="userData.email"
        />
        <span style="font-size: 15.2px; margin-left: 10px;">{{ userData.name }} {{ userData.surname }}</span>
        <v-icon> mdi-menu-down </v-icon>
      </span>
    </template>
    <v-card>
      <v-card-title>Menu de usuario</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item @click="$router.push('/private/profile')">
            <v-list-item-content>Ir al perfil</v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-content>Cerrar sesión</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
import {mapMutations} from 'vuex'
import ImgGravatar from '@/components/img-gravar'

export default {
    components: {ImgGravatar},
    data() {
        return {
            menu: false,
        }
    },
    methods: {
        ...mapMutations(`auth`, [`logout`]),
    },
}
</script>
