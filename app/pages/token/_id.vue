<template>
  <v-card>
    <v-card-title primary-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <app-form
        :request="passRequest"
        text-submit="Recuperar contraseña"
        @success="postRequest"
      >
        <template v-slot:notifier="{response}" />
        <v-text-field
          v-model="form.pass"
          type="password"
          placeholder="Contraseña"
        />
        <v-text-field
          v-model="form.repass"
          type="password"
          placeholder="Repetir contraseña"
        />
      </app-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    data() {
        return {
            form: {
                pass: ``,
                repass: ``,
            },
        }
    },
    head() {
        return {
            title: `Zona de recuperacion`,
        }
    },
    computed: {
        passRequest() {
            return {
                url: `/auth/changePass?token=` + this.$route.params.id,
                method: `post`,
                data: this.form,
            }
        },
        title() {
            return this.$route.query.action === `recoverpass` && `Recuperando contraseña` || `No determinado`
        },
    },
    methods: {
        postRequest(r) {
            this.$router.push(`/`)
            this.notify(`success`, r.data)
        },
    },
}
</script>
