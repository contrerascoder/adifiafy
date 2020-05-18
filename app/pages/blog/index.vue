<template>
  <div>
    <h3 class="display-2">
      Blog de adifia
    </h3>
    <div>
      <v-breadcrumbs
        divider="/"
        :items="breads"
      />
    </div>
    <remote-data url="/articles">
      <template v-slot:data="{data}">
        <article-cards :list="data" />
      </template>
    </remote-data>
    <has-profile profile="author">
      <div slot="not-authed" />
      <div>
        <v-btn
          class="ma-4"
          to="/blog/addarticle"
          fab
          fixed
          icon
          bottom
          right
          color="primary"
        >
          <v-icon>mdi-pen-plus</v-icon>
        </v-btn>
      </div>
    </has-profile>
  </div>
</template>

<script>
import ArticleCards from "@/components/articles/article-cards"
export default {
    components: {ArticleCards},
    head() {
        return {
            title: `Blog de adifia`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: false, text: `Volver a la pantalla principal`, to: `/`, exact: true},
                {disabled: false, text: `Viendo todos los articulos`, exact: true},
            ],
        }
    },
}
</script>
