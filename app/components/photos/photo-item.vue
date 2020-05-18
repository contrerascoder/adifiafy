<template>
  <v-card>
    <v-img
      class="white--text align-end"
      height="200px"
      :src="photo.urlPhoto"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="title">
            {{ photo.title }}
          </h3>
        </div>
      </v-card-title>
    </v-img>
    <v-card-text>
      <p class="subtitle">
        {{ photo.body }}
      </p>
    </v-card-text>
    <v-card-actions v-if="isInPublicPage">
      <v-btn
        :to="'/photos/detail/' + photo._id"
        text
        small
        color="primary"
      >
        Ver en detalle
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="isInAdminPage">
      <v-btn
        :href="photo.urlPhoto"
        text
        target="blank"
        color="primary"
      >
        Ver en detalle
      </v-btn>
      <v-btn
        v-if="!photo.approved"
        text
        color="primary"
        @click="approvePhoto"
      >
        Aprobar
      </v-btn>
      <v-btn
        v-if="photo.approved"
        text
        color="error"
        @click="unapprovePhoto"
      >
        Desaprobar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
    props: {
        photo: {
            type: Object,
            default: null,
        },
    },
    computed: {
        isInPublicPage() {
            return this.$route.name === `photos`
        },
        isInAdminPage() {
            return this.$route.name === `admin-photos`
        },
    },
    methods: {
        async approvePhoto() {
            try {
                await this.axiosRequest({
                    url: `/photos/` + this.photo._id + `/approve`,
                    method: `put`,
                })
                this.notify(`success`, `La foto fue aprobada`)
                this.$store.commit(`photos/approve`, this.photo)
            } catch (error) {
                this.notify(`error`, `Un error sucedio`)
            }
        },
        async unapprovePhoto() {
            try {
                await this.axiosRequest({
                    url: `/photos/` + this.photo._id + `/unapprove`,
                    method: `put`,
                })
                this.notify(`error`, `La foto fue desaprobada`)
                this.$store.commit(`photos/unapprove`, this.photo)
            } catch (error) {
                this.notify(`error`, `Un error sucedio`)
            }
        },
    },
}
</script>
