<template>
  <authed-view>
    <p>No puedes manejar el formulario ya que estas logueado</p>
    <redirect
      to="/"
      :ms="300"
    />
    <template slot="not-authed">
      <app-form
        ref="user-form"
        :request="signUpRequest"
        text-submit="Registrarse"
        text-cancel="Volver"
        @success="successSignup"
        @cancel="activeTab = 0"
      >
        <template v-slot:notifier="{response}" />
        <v-text-field
          v-model="user.name"
          :rules="[fieldRules.name]"
          placeholder="Nombre"
        />
        <v-text-field
          v-model="user.surname"
          :rules="[fieldRules.surname]"
          placeholder="Apellidos"
        />
        <v-text-field
          v-model="user.dni"
          :rules="[fieldRules.dni]"
          placeholder="dni"
        />
        <v-row>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="birth.year"
              :rules="[fieldRules.year]"
              placeholder="Año"
            />
          </v-col>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="birth.month"
              :rules="[fieldRules.month]"
              placeholder="Mes"
            />
          </v-col>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="birth.day"
              :rules="[fieldRules.day]"
              placeholder="Dia"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="user.phone"
          :rules="[fieldRules.phone]"
          placeholder="Telefono"
        />
        <v-text-field
          v-model="user.email"
          :rules="[fieldRules.email]"
          placeholder="Email"
        />
        <v-text-field
          v-model="user.password"
          placeholder="Contraseña"
          type="password"
        />
        <v-text-field
          v-model="user.repassword"
          placeholder="Repetir contraseña"
          type="password"
        />
      </app-form>
    </template>
  </authed-view>
</template>
<script>
import {mapFields} from 'vuex-map-fields'
export default {
    data() {
        return {
            birth: {
                year: 2000,
                month: 1,
                day: 1,
            },
            user: {
                dni: ``,
                email: ``,
                password: ``,
                phone: ``,
                name: ``,
                surname: ``,
                repassword: ``,
            },
        }
    },
    computed: {
        ...mapFields(`auth`, [`token`, `userData`]),
        emailIsValid() {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(this.user.email).toLowerCase())
        },
        signUpRequest() {
            return {
                method: `post`,
                url: `/auth/signup`,
                data: {
                    ...this.user,
                    ...this.birth,
                },
            }
        },
    },
    methods: {
        async successSignup() {
            try {
                this.notify(`success`, `Todo ha ido bien`)
                this.resetForm()
                this.$router.push(`/`)
            } catch (error) {
            }
        },
        resetForm() {
            this.user.dni = ``
            this.user.email = ``
            this.user.password = ``
            this.user.phone = ``
            this.user.name = ``
            this.user.surname = ``
            this.user.age = ``
            this.user.repassword = ``
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
