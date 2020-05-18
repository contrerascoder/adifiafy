<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="title">
          Listado de artículos {{ $route.name }}
        </h3>
      </div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="articles"
      >
        <template v-slot:item.writer="d">
          <span>{{ d.item.author.user.name }} {{ d.item.author.user.surname }}</span>
        </template>
        <template v-slot:item.operations="d">
          <v-btn
            v-if="d.item.state === 'in_draft'"
            color="success"
            small
            text
            @click="reviewArticle(d.item)"
          >
            Enviar a revision
          </v-btn>
          <v-btn
            v-if="d.item.state === 'reviewing' && !reviewing"
            color="success"
            small
            text
            @click="draftArticle(d.item)"
          >
            Guardar en borradores
          </v-btn>
          <v-btn
            v-if="d.item.state === 'reviewing' && reviewing"
            color="success"
            small
            text
            @click="publishArticle(d.item)"
          >
            Publicar articulo
          </v-btn>
          <v-btn
            v-if="d.item.state === 'published' && reviewing"
            color="success"
            small
            text
            @click="reviewArticle(d.item)"
          >
            Revisar articulo
          </v-btn>
          <v-btn
            v-if="d.item.state !== 'published'"
            :to="'/blog/addarticle?id=' + d.item._id + '&back=' + backUrl"
            color="info"
            small
            text
          >
            Editar
          </v-btn>
          <v-btn
            v-if="d.item.state === 'published'"
            text
            small
            color="primary"
            disabled
          >
            Este articulo esta publicado
          </v-btn>
        </template>
        <template v-slot:item.state="d">
          <v-chip>{{ d.item.state | stateFilter }}</v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import lodash from 'lodash'

const state = {
    in_draft: `En borradores`,
    reviewing: `En revision`,
    published: `Publicado`,
}
export default {
    filters: {
        stateFilter(value) {
            return state[value]
        },
    },
    props: {
        backUrl: {
            type: String,
            default: `/profile`,
        },
        list: {
            type: Array,
            default: () => [],
        },
        reviewing: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const headers = [
            {text: `Título`, value: `title`},
            {text: `Estado`, value: `state`, width: 200},
            {text: `Operaciones`, value: `operations`, width: 200},
        ]
        if (this.$route.name === `admin-articles`) {
            headers.splice(1, 0, {text: `Escrito por`, value: `writer`})
        }
        return {
            articles: [],
            headers: headers,
        }
    },
    mounted() {
        this.articles = this.list
    },
    methods: {
        async reviewArticle(article) {
            try {
                await this.axiosRequest({
                    url: `/articles/` + article._id + `/review`,
                    method: `put`,
                })
                const index = lodash.findIndex(this.articles, {_id: article._id})
                this.articles[index].state = `reviewing`
                this.notify(`success`, `El articulo fue enviado a revision`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
        async publishArticle(article) {
            try {
                await this.axiosRequest({
                    url: `/articles/` + article._id + `/publish`,
                    method: `put`,
                })
                const index = lodash.findIndex(this.articles, {_id: article._id})
                this.articles[index].state = `published`
                this.notify(`success`, `El articulo se publicó`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
        async draftArticle(article) {
            try {
                await this.axiosRequest({
                    url: `/articles/` + article._id + `/draft`,
                    method: `put`,
                })
                const index = lodash.findIndex(this.articles, {_id: article._id})
                this.articles[index].state = `in_draft`
                this.notify(`success`, `El articulo fue guardado en borradores`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
    },
}
</script>
