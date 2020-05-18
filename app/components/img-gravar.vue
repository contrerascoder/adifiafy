<template>
  <img
    :height="height"
    :src="imageGravatar"
  >
</template>
<script>
import md5 from 'md5'
export default {
    props: {
        email: {
            type: String,
            required: true,
        },
        height: {
            type: String,
            default: `auto`,
        },
    },
    computed: {
        imageGravatar() {
            return `https://www.gravatar.com/avatar/${this.md5Email}?d=identicon`
        },
        md5Email() {
            return md5(this.email)
        },
    },
}
</script>
