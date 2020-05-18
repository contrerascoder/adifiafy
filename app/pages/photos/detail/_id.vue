<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="title">
          Detalle de foto
        </h3>
      </div>
    </v-card-title>
    <v-card-text>
      <photo-poster
        v-if="photo"
        :photo="photo"
      />
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between">
      <photo-thumb
        v-if="backPhoto && currentPhoto !== 0"
        text="Anterior foto"
        :photo="backPhoto"
      />
      <v-btn
        outlined
        to="/photos"
        color="primary"
      >
        Ver todas las fotos
      </v-btn>
      <photo-thumb
        v-if="nextPhoto && currentPhoto !== items.docs.length - 1"
        text="Siguiente foto"
        :photo="nextPhoto"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapState} from "vuex"
import PhotoPoster from "@/components/photos/photo-poster.vue"
import PhotoThumb from '@/components/photos/photo-thumb'
export default {
    components: {PhotoPoster, PhotoThumb},
    head() {
        return {
            title: `Detalle de foto`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: false, text: `Pagina principal`, to: `/`},
                {disabled: true, text: `Detalle de foto`},
            ],
        }
    },
    async mounted() {
        if (this.items.docs.length) {
            return
        }
        try {
            const r = await this.axiosRequest({
                url: `/photos/` + this.$route.params.id,
            })
            this.$store.commit(`photos/addAll`, r.data)
        } catch (error) {
            this.$router.push(`/photos`)
        }
    },
    computed: {
        ...mapState(`photos`, [`items`]),
        photo() {
            const self = this
            // debugger
            return this.items.docs.filter((photo) => photo._id === self.$route.params.id)[0]
        },
        currentPhoto() {
            return this.items.docs.indexOf(this.photo)
        },
        backPhoto() {
            return this.items.docs[this.currentPhoto - 1]
        },
        nextPhoto() {
            return this.items.docs[this.currentPhoto + 1]
        },
    },
}
</script>
