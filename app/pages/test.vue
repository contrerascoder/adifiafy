<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">
          Pagina para probar cosas
        </h3>
      </div>
    </v-card-title>
    <v-card-text>
      <gmappicker />
    </v-card-text>
  </v-card>
</template>

<script>
import gmappicker from "@/components/ui/gmappicker.vue"
export default {
    components: {gmappicker},
    data() {
        return {
            photo: null,
        }
    },
    head() {
        return {
            title: `Pagina para probar cosas...`,
        }
    },
}
</script>
