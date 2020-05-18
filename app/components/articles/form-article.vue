<template>
  <app-form
    :request="creationRequest"
    :text-submit="$route.query.id ? &quot;Actualizar articulo&quot; : &quot;Crear artículo&quot;"
    text-cancel="Volver"
    @success="successCreation"
    @cancel="$router.push(&quot;/blog&quot;)"
  >
    <template v-slot:notifier="{response}" />
    <v-container>
      <v-row>
        <v-col :cols="8">
          <v-text-field
            v-model="form.title"
            placeholder="Título"
          />
          <editor-js
            v-if="$route.query.id && form.body !== null || !$route.query.id"
            ref="editor"
            v-model="form.body"
            :saved-data="form.body"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.category"
            placeholder="Categoria"
          />
          <v-autocomplete
            v-model="form.tags"
            :items="tagsQueried"
            item-text="name"
            item-value="_id"
            hide-selected

            multiple
            chips
            :search-input.sync="queryTag"
            small-chips
          />
        </v-col>
      </v-row>
    </v-container>
  </app-form>
</template>
<script>
import EditorJs from '@/components/ui/editor-js'
export default {
    components: {EditorJs},

    data() {
        return {
            queryTag: ``,
            tagsQueried: [],
            form: {
                title: ``,
                body: null,
                category: ``,
                tags: [],
            },
        }
    },
    computed: {
        creationRequest() {
            return this.$route.query.id ? {
                method: `put`,
                url: `/articles/` + this.$route.query.id,
                data: {
                    ...this.form,
                },
            } : {
                method: `post`,
                url: `/articles`,
                data: {
                    ...this.form,
                },
            }
        },
    },
    watch: {
        async queryTag(current, old) {
            if (!current) {
                // this.tagsQueried = []
                return
            }
            this.searchTags(current)
        },
    },
    async mounted() {
        if (this.$route.query.id) {
            const d = await this.axiosRequest({
                url: `/articles/` + this.$route.query.id,
            })
            this.form.title = d.data.title
            this.form.category = d.data.category
            this.form.body = d.data.body
            this.form.tags = d.data.tags

            const tags = await this.axiosRequest({
                url: `/articles/tags`,
            })
            this.tagsQueried = tags.data
        } else {
            this.form.body === {}
        }
    },
    methods: {
        async searchTags(query) {
            const r = await this.axiosRequest({
                url: `/articles/tags?query=` + query,
            })
            this.tagsQueried = r.data
        },
        successCreation() {
            const msg = this.$route.query.id ? `El articulo se actualizo con exito` : `El articulo se creo con exito`
            this.notify(`success`, msg)
            this.$router.push(this.$route.query.back || `/profile`)
        },
    },
}
</script>
