<template>
  <div ref="container-data">
    <template v-if="data">
      <template v-if="list">
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <slot
            name="item"
            :item="item"
          >
            <div class="item">
              <json-pretty :data="item" />
            </div>
          </slot>
        </div>
      </template>
      <template v-else>
        <slot
          name="data"
          :data="data"
        >
          <json-pretty :data="data" />
        </slot>
      </template>
    </template>
  </div>
</template>
<script>
import lodash from 'lodash'
/**
 * Ver si la ventana esta abajo del todo
 * @return {boolean}
 */
function isAtBottom() {
    const windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom
    return windowRelativeBottom < document.documentElement.clientHeight + 100
}

export default {
    props: {
        url: {
            type: String,
            default: ``,
        },
        list: {
            type: Boolean,
            default: false,
        },
        shouldEmit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            data: null,
        }
    },
    async mounted() {
        try {
            const r = await this.axiosRequest({url: this.url})
            this.data = r.data
            this.$emit(`input`, this.data)
        } catch (error) {
            if (/jwt expired/.test(error.response.data.message)) {
                this.notify(`error`, `Tu sesión ha caducado`)
                this.token = null
            }
        }

        this.spyScroll()
    },
    methods: {
        spyScroll() {
            const self = this
            window.onscroll = lodash.debounce((e) => {
                if (isAtBottom()) {
                    self.shouldEmit && self.$emit(`load-more`)
                }
            }, 200)
        },
    },
}
</script>
<style scoped>
.item {
    border: 1px solid;
    padding: 10px;
    margin: 1em;
}
</style>
