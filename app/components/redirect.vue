<template>
  <p>Redireccionando a {{ to }}</p>
</template>
<script>
export default {
    props: {
        to: {
            type: String,
            required: true,
        },
        ms: {
            type: Number,
            default: 3000,
        },
    },
    mounted() {
        setTimeout(() => {
            this.$router.push(this.to)
        }, this.ms)
    },
}
</script>
