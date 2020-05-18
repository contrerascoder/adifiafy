<template>
  <v-app app>
    <no-ssr>
      <has-profile profile="administrator">
        <template slot="not-authed">
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">
                  No le es permitido acceder al area de administración
                </h3>
              </div>
            </v-card-title>
            <v-card-text>
              Debe de irse
              <redirect
                to="/"
                :ms="1"
              />
            </v-card-text>
          </v-card>
        </template>
        <v-app-bar
          app
          dark
        >
          <v-btn icon>
            <v-icon @click.stop="$router.push('/')">
              mdi-arrow-left
            </v-icon>
          </v-btn>
          <v-toolbar-title
            style="cursor: pointer"
            @click="$router.push('/admin')"
          >
            Zona administrativa
          </v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              to="/admin/users"
              text
            >
              Usuarios
            </v-btn>
            <v-btn
              to="/admin/events"
              text
            >
              Eventos
            </v-btn>
            <v-btn
              to="/admin/photos"
              text
            >
              Fotos
            </v-btn>
            <v-btn
              to="/admin/articles"
              text
            >
              Articulos
            </v-btn>
          </v-toolbar-items>
        </v-app-bar>
        <v-content
          app
          class="ma-4"
        >
          <nuxt-child />
        </v-content>
      </has-profile>
    </no-ssr>
  </v-app>
</template>

<script>
export default {
    head() {
        return {
            title: `Zona administrativa`,
        }
    },
}
</script>
