<template>
  <div>
    <v-card
      v-for="(article, index) in list"
      :key="index"
      class="article"
    >
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            <nuxt-link :to="'/blog/' + article._id">
              {{ article.title }}
            </nuxt-link>
          </h3>
          <div class="article_author">
            {{ article.author.user.name }} {{ article.author.user.surname }}
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-html="returnContent(article.body)" />
      </v-card-text>
      <v-card-actions>
        <v-chip-group>
          <v-chip
            v-for="(tag, indexTag) in article.tags"
            :key="indexTag"
          >
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
      </v-card-actions>
    </v-card>
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
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        returnContent(body) {
            const blocks = body.blocks.map((block) => {
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
            })
            return [blocks[0], blocks[1]].join(``)
        },
    },
}
</script>
<style lang="scss">
.article {
    margin: 10px 0px;
}
.article_author {
  color: lightgrey;
  font-size: 0.8em;
}
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
    width: 60% !important;
  }
  & > img {
    width: 50%;
  }
}
</style>
