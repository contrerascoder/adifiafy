<template>
  <no-ssr>
    <div
      v-if="userData"
    >
      <div>
        <h3 class="display-2">
          Pagina de perfil
        </h3>
        <div>
          <v-breadcrumbs
            divider="/"
            :items="breads"
          />
        </div>
      </div>
      <p>Bienvenido {{ userData.name }} {{ userData.surname }}</p>
      <remote-data url="/articles?scope=own">
        <template v-slot:data="{data}">
          <article-list :list="data.articles" />
        </template>
      </remote-data>
    </div>
  </no-ssr>
</template>

<script>
import ArticleList from "@/components/articles/article-list"
export default {
    components: {ArticleList},
    head() {
        return {
            title: `Pagina de perfil`,
        }
    },
    data() {
        return {
            breads: [
                {disabled: false, text: `Pagina principal`, to: `/`},
                {disabled: true, text: `Pagina de perfil`},
            ],
        }
    },
}
</script>
