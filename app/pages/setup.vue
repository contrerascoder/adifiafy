<template>
  <v-card>
    <v-card-title primary-title>
      Configuracicón inicial
    </v-card-title>
    <v-card-text>
      <app-form
        :request="setupRequest"
        text-submit="proceder"
        @success="successSetup"
      >
        <template v-slot:notifier="{response}" />

        <v-row>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="userInfo.name"
              :rules="[fieldRules.name]"
              placeholder="Nombre"
            />
          </v-col>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="userInfo.surname"
              :rules="[fieldRules.surname]"
              placeholder="Apellidos"
            />
          </v-col>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="userInfo.dni"
              :rules="[fieldRules.dni]"
              placeholder="DNI"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            xs="12"
            md="4"
          >
            <v-text-field
              v-model="birth.year"
              type="number"
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
              type="number"
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
              type="number"
              :rules="[fieldRules.day]"
              placeholder="Dia"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="userInfo.charge"
              :rules="[fieldRules.charge]"
              placeholder="Cargo"
            />
            <v-text-field
              v-model="userInfo.phone"
              :rules="[fieldRules.phone]"
              placeholder="Telefono"
            />
            <v-text-field
              v-model="userInfo.email"
              :rules="[fieldRules.email]"
              placeholder="Correo electrónico"
            />
            <v-text-field
              v-model="userInfo.password"
              placeholder="Contraseña"
              type="password"
            />
            <v-text-field
              v-model="userInfo.repassword"
              placeholder="Repetir contraseña"
              type="password"
            />
          </v-col>
        </v-row>
      </app-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
    head() {
        return {
            title: `Configuración inicial`,
        }
    },
    data() {
        return {
            birth: {
                year: ``,
                month: ``,
                day: ``,
            },
            userInfo: {
                name: ``,
                surname: ``,
                dni: ``,
                charge: ``,
                email: ``,
                phone: ``,
                rol: `attorney`,
                password: ``,
                repassword: ``,
            },
        }
    },
    computed: {
        setupRequest() {
            return {
                url: `/auth/signup`,
                method: `post`,
                data: {
                    ...this.userInfo,
                    ...this.birth,
                },
            }
        },
        birthDate() {
            return new Date(`${this.birth.month}/${this.birth.day}/${this.birth.year}`)
        },
    },
    async mounted() {
        const r = await this.$axios.get(`/need-setup`)
        if (r.data !== `T`) {
            this.$router.push(`/`)
        }
    },
    methods: {
        successSetup() {
            alertify.success(`Enhorabuena, la configuración esta lista`)
            this.$router.push(`/`)
        },
    },
}
</script>
