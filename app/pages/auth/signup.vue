<template>
  <div>
    <div>
      <h3 class="headline mb-0">
        Registrate en adifia
      </h3>
    </div>
    <register-form />
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/form-register'
export default {
    components: {RegisterForm},
    head() {
        return {
            title: `Registrate en adifia`,
        }
    },
}
</script>
