<template>
  <img
    :src="src"
    class="box"
    @drop.prevent="handleDropImage"
    @click="askForImage"
  >
</template>
<script>
export default {
    data() {
        return {
            src: null,
        }
    },
    computed: {
        fileInput() {
            const input = document.createElement(`input`)
            input.onchange = this.renderImage
            input.type = `file`
            return input
        },
    },
    methods: {
        askForImage(e) {
            this.fileInput.click()
        },
        renderImage(e) {
            const blob = e.target.files[0]
            this.$emit(`input`, blob)
            const reader = new FileReader()

            reader.onloadend = () => {
                this.src = reader.result
            }
            reader.onerror = () => {
                this.notify(`error`, `La imagen no se pudo leer correctamente`)
            }

            reader.readAsDataURL(blob)
        },
    },
}
</script>

<style scoped>
.box {
    min-height: 400px;
    width: 100%;
    border: 1px solid black;
}
img {
    max-width: 100%;
    object-fit: cover;
}
</style>
