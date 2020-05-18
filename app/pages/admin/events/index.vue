<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="display-2">
          Administrando eventos
        </h3>
        <div>
          <v-breadcrumbs
            divider="/"
            :items="breads"
          />
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-end">
        <v-btn
          class="elevation-0"
          to="/admin/events/editor"
          color="primary"
        >
          Añadir evento
        </v-btn>
      </div>
      <events-table />
    </v-card-text>
    <nuxt-child />
  </v-card>
</template>

<script>
import EventsTable from '@/components/events/events-table.vue'
export default {
    components: {EventsTable},
    layout: `admin`,
    head() {
        return {
            title: `Administración de eventos`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: true, text: `Listado de eventos`},
            ],
        }
    },
}
</script>
