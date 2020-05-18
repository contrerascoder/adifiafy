<template>
  <div>
    <remote-data
      url="/articles?scope=review"
    >
      <template v-slot:data="{data}">
        <div>
          <v-breadcrumbs
            divider="/"
            :items="breads"
          />
        </div>

        <v-tabs
          color="primary"
          slider-color="primary"
        >
          <v-tab ripple>
            Listado de artículos
          </v-tab>
          <v-tab ripple>
            Administrar tags
          </v-tab>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <article-list
                  :back-url="'/admin/articles'"
                  :list="data"
                  reviewing
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <tags-list />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </template>
    </remote-data>
  </div>
</template>

<script>
import ArticleList from "@/components/articles/article-list.vue"
import TagsList from '@/components/articles/article-tags.vue'
export default {
    components: {ArticleList, TagsList},
    layout: `admin`,
    head() {
        return {
            title: `Administrando articulos`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: true, text: `Listado de articulos`},
            ],
        }
    },
}
</script>
