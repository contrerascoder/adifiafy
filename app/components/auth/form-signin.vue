<template>
  <authed-view>
    <p>No puedes manejar el formulario ya que estas logueado</p>
    <redirect
      to="/"
      :ms="300"
    />
    <template slot="not-authed">
      <app-form
        ref="login-form"
        :request="loginRequest"
        text-submit="Acceder"
        text-cancel="volver"
        @success="successSignin"
        @cancel="loginDialog = false"
      >
        <template v-slot:notifier="{response}" />
        <v-text-field
          v-model.lazy="user.email"
          placeholder="Email"
        />

        <v-text-field
          v-model="user.password"
          placeholder="Contraseña"
          type="password"
        />
      </app-form>
    </template>
  </authed-view>
</template>
<script>
import {mapFields} from "vuex-map-fields"
export default {
    data() {
        return {
            user: {
                email: ``,
                password: ``,
            },
        }
    },
    computed: {
        ...mapFields(`auth`, [`expirement`]),
        loginRequest() {
            return {
                url: `/auth/signin`,
                method: `post`,
                data: {
                    email: this.user.email,
                    password: this.user.password,
                },
            }
        },
    },
    methods: {
        async successSignin(r) {
            if (r.status !== 200) {
                this.notify(`error`, `Por favor vuelve a intentarlo`)
                return
            }
            this.token = r.data.token
            this.notify(`success`, `Bienvenido al sistema`)
            const userReq = await this.axiosRequest({
                url: `/auth/moreInfo?id=${r.data.user._id}`,
            })
            this.token = r.data.token
            this.userData = userReq.data
            // const d = moment().add(10, `seconds`)
            this.resetForm()
            this.$router.push(this.$route.query.backurl || `/`)
        },
        resetForm() {
            this.user.email = ``
            this.user.password = ``
        },
    },
}
</script>
<style scoped>
.photo {
    position: absolute;
    background: white;
    max-height: 80px;
    border-radius: 2000px;
    left: 50%;
    top: -45px;
    transform: translateX(-50%)
}
</style>
