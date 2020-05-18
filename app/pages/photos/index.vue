<template>
  <div>
    <h3 class="display-2">
      Foto denuncia
    </h3>
    <div>
      <v-breadcrumbs
        divider="/"
        :items="breads"
      />
    </div>
    <remote-data
      v-model="items"
      :should-emit="items.hasNextPage"
      url="/photos"
      @load-more="loadMore"
    >
      <template v-slot:data="{data}">
        <photo-list :photo-list="items.docs" />
      </template>
    </remote-data>
    <div>
      <v-btn
        style=""
        fixed
        to="/photos/addphoto"
        bottom
        right
        fab
        dark
        color="primary"
      >
        <v-icon dark>
          mdi-image-plus
        </v-icon>
      </v-btn>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import PhotoList from "@/components/photos/photo-list.vue"
import {mapFields} from "vuex-map-fields"
export default {
    components: {PhotoList},
    head() {
        return {
            title: `Foto denuncia`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: false, text: `Pagina principal`, to: `/`},
                {disabled: true, text: `Foto denuncia`},
            ],
        }
    },
    mounted() {
        /* const meta = document.querySelector(`meta[name="socketoptions"]`)
        const socket = io.connect(`/`, {path: JSON.parse(meta.content)})
        socket.on(`photo.published:ADD`, (photo) => {
            this.$store.commit(`photos/addFirst`, photo)
        })
        socket.on(`photo.published:REMOVE`, (photo) => {
            this.$store.commit(`photos/remove`, photo)
        })*/
    },
    computed: {
        ...mapFields(`photos`, [`items`]),
    },
    methods: {
        async loadMore() {
            const lastId = this.items.docs[this.items.docs.length - 1]._id
            const r = await this.axiosRequest({
                url: `/photos?lastId=` + lastId,
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
