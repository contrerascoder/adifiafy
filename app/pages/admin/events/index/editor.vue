<template>
  <v-dialog
    :value="true"
    @click:outside="$router.push('/admin/events')"
  >
    <v-card>
      <v-card-title>Añadir un evento</v-card-title>
      <v-card-text>
        <editor-events :scrollel="$el" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EditorEvents from '@/components/events/editor-events.vue'
export default {
    components: {EditorEvents},
    data() {
        return {
            dialog: true,
        }
    },
}
</script>
