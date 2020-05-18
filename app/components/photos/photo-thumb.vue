<template>
  <div>
    <v-card
      v-if="photo"
      outlined
      :to="'/photos/detail/' + photo._id"
      style="max-width: 200px"
    >
      <v-img
        class="white--text align-end"
        height="100px"
        :src="photo.urlPhoto"
      >
        <v-card-title primary-title>
          <div>
            <h3 class="caption mt-1">
              {{ photo.title }}
            </h3>
          </div>
        </v-card-title>
      </v-img>
      <v-card-text>
        <p class="ma-0 subtitle">
          {{ text }}
        </p>
      </v-card-text>
    </v-card>
    <v-card
      v-else
      outlined
    >
      <v-card-title primary-title>
        <div>
          <h3 class="caption mt-1">
            No hay mas fotos
          </h3>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
export default {
    props: {
        photo: {
            type: Object,
            default: null,
        },
        text: {
            type: String,
            default: ``,
        },
    },
    data() {
        return {
            srcPlaceholder: `https://drscdn.500px.org/photo/1006452249/q%3D80_m%3D2000/v2?sig=f2db0684539f67ad820dacc253f649fe16d5ed05cd26982d6d2531bee45a16b0`,
        }
    },
}
</script>
