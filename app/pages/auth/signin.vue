<template>
  <div>
    <h3 class="headline mb-0">
      Accede a adifia
    </h3>
    <sign-in-form />
  </div>
</template>

<script>
import SignInForm from '@/components/auth/form-signin'
export default {
    components: {SignInForm},
    head() {
        return {
            title: `Registrate en adifia`,
        }
    },
}
</script>
