<template>
  <span>
    <slot v-if="isAuthed">
      <span>Estas autenticado</span>
    </slot>
    <slot
      v-else
      name="not-authed"
    >
      <span>No estas autenticado</span>
    </slot>
  </span>
</template>
<script>
// import {mapState} from 'vuex'
export default {
    computed: {
        // ...mapState(`auth`, [`token`]),
        isAuthed() {
            if (this.token) {
                this.$axios.setToken(this.token)
            }
            return this.token !== null
        },
    },
}
</script>
