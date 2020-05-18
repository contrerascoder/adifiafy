<template>
  <remote-data
    v-model="items"
    url="/events"
  >
    <template v-slot:data>
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template v-slot:item.operations="{item}">
          <v-btn
            :to="'/admin/events/editor?id=' + item._id"
            text
            small
            color="primary"
          >
            Editar
          </v-btn>
          <v-btn
            v-if="!item.approved"
            text
            small
            color="primary"
            @click="approveEvent(item)"
          >
            Aprobar
          </v-btn>
          <v-btn
            v-else
            text
            small
            color="error"
            @click="unapproveEvent(item)"
          >
            Desaprobar
          </v-btn>
        </template>
        <template v-slot:item.date="{item}">
          <span>{{ item.datetime | standardDate }}</span>
        </template>
        <template v-slot:item.status="{item}">
          <span>{{ item.approved && "Aprobado" || "No aprobado" }}</span>
        </template>
      </v-data-table>
    </template>
  </remote-data>
</template>

<script>
import {mapFields} from "vuex-map-fields"
import {mapMutations} from "vuex"
export default {
    data() {
        return {
            headers: [
                {value: `title`, text: `Título`},
                {value: `body`, text: `Descripcion`},
                {value: `date`, text: `Fecha`},
                {value: `status`, text: `Estado`},
                {value: `operations`, text: `Operaciones`},
            ],
        }
    },
    computed: {
        ...mapFields(`events`, [`items`]),
    },
    beforeDestroy() {
        this.items = []
    },
    methods: {
        ...mapMutations(`events`, [`edit`]),
        async approveEvent(item) {
            try {
                await this.axiosRequest({
                    method: `put`,
                    url: `/events/` + item._id + `/approve`,
                })
                this.edit({
                    ...item,
                    approved: true,
                })
                this.notify(`success`, `Evento aprobado`)
            } catch (error) {
                this.notify(`error`, `Sucedio un error no esperado`)
            }
        },
        async unapproveEvent(item) {
            try {
                await this.axiosRequest({
                    method: `put`,
                    url: `/events/` + item._id + `/unapprove`,
                })
                this.edit({
                    ...item,
                    approved: false,
                })
                this.notify(`success`, `Evento desaprobado`)
            } catch (error) {
                this.notify(`error`, `Sucedio un error no esperado`)
            }
        },
    },
}
</script>
