<template>
  <div>
    <remote-data
      v-model="article"
      :url="'/articles/' + $route.params.id"
    >
      <template v-slot:data="{data}">
        <div>
          <h3 class="display-2">
            {{ article.title }}
          </h3>
          <div>
            <v-breadcrumbs
              divider="/"
              :items="breads"
            />
          </div>
          <div>
            <div>Escrito por: {{ article.author.user.name }} {{ article.author.user.surname }}</div>
            <div v-html="returnContent" />
          </div>
        </div>
      </template>
    </remote-data>
  </div>
</template>

<script>
/**
 * Conseguir las clases para los container de la imagen
 * @param {Object} flags
 * @return {String}
 */
function getImageClases(flags) {
    const filters = {
        stretched: `stretched`,
        withBackground: `with-background`,
        withBorder: `with-border`,
    }
    const classes = []
    for (const key in flags) {
        if (flags.hasOwnProperty(key)) {
            const flag = flags[key]
            if (flag) classes.push(filters[key])
        }
    }
    return classes.join(` `)
}

export default {
    head() {
        return {
            title: this.article.title,
        }
    },
    data() {
        return {
            article: {
                title: `Cargando articulo...`,
            },
            breads: [
                {disabled: false, text: `Volver a la pantalla principal`, to: `/`, exact: true},
                {disabled: false, text: `Ver todos los articulos`, to: `/blog`, exact: true},
                {disabled: true, text: `Detalle de articulo`},
            ],
        }
    },
    computed: {
        returnContent() {
            return this.article.body && this.article.body.blocks.map((block) => {
                if (block.type===`paragraph`) {
                    return `<p>${block.data.text}</p>`
                } else if (block.type === `header`) {
                    return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
                } else if (block.type === `image`) {
                    const {stretched, withBackground, withBorder} = block.data
                    const url = block.data.file.url
                    return `<div class="img-container ${getImageClases({stretched, withBackground, withBorder})}">
                      <img src="${url}" />
                    </div>`
                } else {
                    return block.type
                }
            }).join(``)
        },
    },
}
</script>
<style lang="scss">
.img-container {
  &.with-background {
    display: flex;
    justify-content: center;
    background: lightgrey;
    padding: 10px 0px;
  }
  &.with-border > img {
    border: 1px solid;
  }
  &.stretched > img {
    width: 90%;
  }
  & > img {
    width: 60%;
  }
}
</style>
