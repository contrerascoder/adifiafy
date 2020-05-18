<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">
          Zona administrativa
        </h3>
      </div>
    </v-card-title>
    <v-card-text>
      <div>
        <p>Tabla de usuarios</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    layout: `admin`,
    head() {
        return {
            title: `Zona administrativa`,
        }
    },
}
</script>
