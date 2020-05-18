<template>
  <v-card outlined="">
    <v-card-title
      color="transparent"
      primary-title
    >
      <div>
        <h3 class="subtitle-1 ma-0">
          El tipo de perfil es: {{ profile.name | nameProfile }}
        </h3>
      </div>
    </v-card-title>
    <v-card-text>
      <template v-if="profile.name === 'administrator'">
        <p class="ma-0">
          El tipo de administrador es: {{ profile.typeAdmin }}
        </p>
      </template>
      <template v-if="profile.name === 'author'">
        <p class="ma-0">
          Este usuario ha escrito {{ profile.articles.length }} articulos
        </p>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="profile.name !== 'administrator'"
        text
        small
        color="error"
        @click="removeProfile"
      >
        Eliminar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const replacements = {
    administrator: `Administrador`,
    author: `Autor`,
}
export default {
    filters: {
        nameProfile(value) {
            return replacements[value]
        },
    },
    props: {
        profile: {
            type: Object,
            default: null,
        },
    },
    methods: {
        async removeProfile() {
            await this.axiosRequest({
                method: `delete`,
                url: `/profile/` + this.profile.name + `/` + this.profile.user,
            })
            this.$emit(`delete-profile`, this.profile)
        },
    },
}
</script>
