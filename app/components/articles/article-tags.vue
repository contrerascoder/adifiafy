<template>
  <div>
    <div class="d-flex justify-md-space-between">
      <h2>Listado de tags</h2>
      <v-btn
        small
        color="success"
        @click="addTag"
      >
        Añadir tag
      </v-btn>
    </div>
    <tag
      v-for="tag in tags"
      :key="tag.id"
      :item="tag"
      @inhabilitate-tag="inhabilitateTag"
      @habilitate-tag="habilitateTag"
      @update-tag="updateTag"
    />
  </div>
</template>
<script>
import Tag from './article-tag'
import lodash from 'lodash'
export default {
    components: {Tag},
    data() {
        return {
            tags: [],
        }
    },
    async mounted() {
        const r = await this.axiosRequest({
            method: `get`,
            url: `/tags/all`,
        })
        this.tags = r.data
    },
    methods: {
        updateTag(r) {
            const index = lodash.findIndex(this.tags, {_id: r._id})
            this.tags[index].name = r.name
        },
        inhabilitateTag(r) {
            const index = lodash.findIndex(this.tags, {_id: r._id})
            this.tags[index].disabled = true
        },
        habilitateTag(r) {
            const index = lodash.findIndex(this.tags, {_id: r._id})
            this.tags[index].disabled = false
        },
        async addTag() {
            alertify.prompt(`¿Cual es el nombre del nuevo tag?`, ``, ``, async (evt, value) => {
                const r = await this.axiosRequest({
                    url: `/tags`,
                    method: `post`,
                    data: {name: value},
                })
                this.tags.push(r.data)
            }, () => this.notify(`success`, `Has cancelado`))
        },
    },
}
</script>
