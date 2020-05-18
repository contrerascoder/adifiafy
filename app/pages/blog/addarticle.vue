<template>
  <form-article />
</template>

<script>
import FormArticle from "@/components/articles/form-article"
export default {
    components: {FormArticle},
    head() {
        return {
            title: `Creación de un artículo`,
        }
    },
}
</script>
