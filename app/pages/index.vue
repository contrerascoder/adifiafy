<template>
  <div>
    <h3 class="display-2 mb-0">
      Bienvenido a adifia
    </h3>
    <v-breadcrumbs
      divider="/"
      :items="breads"
    >
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <last-event />
    <template v-if="ready">
      <adifia-carousel v-if="wWidth > 1024" />
      <adifia-acordeon v-else />
    </template>
    <div class="d-flex justify-end">
      <v-dialog v-model="aboutDialog">
        <template v-slot:activator="{on}">
          <v-btn
            class="ma-3"
            color="primary"
            v-on="on"
          >
            Leer mas acerca de adifia
          </v-btn>
        </template>
        <adifia-about />
      </v-dialog>
    </div>
    <div v-if="lastArticles">
      <h3>Ultimos articulos</h3>
      <article-cards :list="lastArticles" />
    </div>
    <div v-if="lastPhotos">
      <h3>Ultimas fotos</h3>
      <photo-list :photo-list="lastPhotos" />
    </div>
  </div>
</template>
<script>
import AdifiaCarousel from '@/components/ui/adifia-carousel.vue'
import AdifiaAbout from '@/components/ui/adifia-about'
import AdifiaAcordeon from '@/components/ui/adifia-acordeon'
import LastEvent from '@/components/events/last-event'
import ArticleCards from "@/components/articles/article-cards"
import PhotoList from "@/components/photos/photo-list.vue"

export default {
    components: {AdifiaCarousel, AdifiaAbout, LastEvent, AdifiaAcordeon, ArticleCards, PhotoList},
    head() {
        return {
            title: `Pagina principal`,
        }
    },
    data() {
        return {
            ready: false,
            lastArticles: [],
            lastPhotos: [],
            aboutDialog: false,
            wWidth: typeof window !== `undefined` && window.innerWidth,
            breads: [
                {disabled: true, text: `home`, to: `#`},
            ],
        }
    },
    async mounted() {
        const resArticles = await this.axiosRequest({
            url: `/articles/last`,
        })
        this.lastArticles = resArticles.data
        const resPhotos = await this.axiosRequest({
            url: `/photos/last`,
        })
        this.lastPhotos = resPhotos.data.docs
        window.setTimeout(() => {
            this.ready = true
        }, 100)

        /* const meta = document.querySelector(`meta[name="socketoptions"]`)
        const socket = io.connect(`/`, {path: JSON.parse(meta.content)})
        socket.emit(`MESSAGE`, JSON.stringify({a: 1, b: `sdm dsndsds`, c: 232324}))
        socket.on(`MESSAGE_BACK`, m => this.notify(`error`, m)
)*/
    },
}
</script>
