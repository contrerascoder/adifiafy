<template>
  <div
    ref="container-photos"
  >
    <h3 class="display-2">
      Listado de fotos de la web
    </h3>
    <div>
      <v-breadcrumbs
        divider="/"
        :items="breads"
      />
    </div>
    <remote-data
      v-model="items"
      url="/photos?scope=all"
      :should-emit="items.hasNextPage"
      @load-more="loadMore"
    >
      <template
        v-slot:data="{data}"
        outlined
      >
        <v-container>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn
                text
                :outlined="filters.showApproved"
                :color="filters.showApproved && 'primary' || '#444'"
                @click="filters.showApproved = !filters.showApproved"
              >
                Ver aprobados
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <photo-list :photo-list="photos" />
      </template>
    </remote-data>
  </div>
</template>

<script>
import PhotoList from "@/components/photos/photo-list"
import {mapFields} from "vuex-map-fields"
export default {
    layout: `admin`,
    components: {PhotoList},
    data() {
        return {
            filters: {
                showApproved: true,
            },
            breads: [
                {disabled: true, text: `Listado de fotos`},
            ],
        }
    },
    head() {
        return {
            title: `Administración de fotos`,
        }
    },
    computed: {
        ...mapFields(`photos`, [`items`]),
        photos() {
            return [...this.items.docs].filter((photo) => {
                if (!this.filters.showApproved && photo.approved) return false // Ocultar aprobados

                return true
            })
        },
    },
    beforeDestroy() {
        this.items = []
    },
    methods: {
        async loadMore() {
            const lastId = this.items.docs[this.items.docs.length - 1]._id
            const r = await this.axiosRequest({
                url: `/photos?scope=all&lastId=` + lastId,
            })
            const items = [...this.items.docs, ...r.data.docs]
            const page = {
                ...r.data,
                docs: items,
            }
            this.items = page
        },
    },
}
</script>
