<template>
  <v-card
    v-if="photo"
    outlined
  >
    <v-img
      class="white--text align-end"
      height="1000px"
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
    <v-card-actions v-if="false">
      <v-btn
        text
        small
        color="primary"
      >
        Ver en detalle
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
}
</script>
