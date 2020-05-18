<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-card
        to="/"
        flat
        class="text-center"
      >
        <v-card-title primary-title>
          <p
            class="ma-0 d-flex justify-center"
            style="width:100%"
          >
            <adifia-logo :factor="1.5" />
          </p>
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Adifia
              </v-list-item-title>
              <v-list-item-subtitle>
                Sin barreras
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>

      <v-list dense>
        <v-list-item
          v-for="(item, index) in links"
          :key="index"
          link
          :to="item.url"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <no-ssr>
        <authed-view>
          <v-list-item v-if="userData">
            <v-list-item-content>
              <v-list-item-title class="title">
                Bienvenido al sistema
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userData.name }} {{ userData.surName }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list dense>
            <v-list-item
              v-for="(item, index) in userLinks"
              :key="index"
              link
              :to="item.url"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn
            text
            class="ma-3"
            color="info"
            @click="logout"
          >
            Logout
          </v-btn>

          <template slot="not-authed">
            <v-list dense>
              <v-list-item
                v-for="(item, index) in guestLinks"
                :key="index"
                link
                :to="item.url"
              >
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </authed-view>
      </no-ssr>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      clipped-left
      dense
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push('/')"
      >
        Adifia
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <v-row>
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import AdifiaLogo from "@/components/ui/adifia-logo"
import {mapGetters} from "vuex"
export default {
    components: {AdifiaLogo},
    data() {
        return {
            drawer: typeof window !== `undefined` && window.innerWidth >= 1440,
            links: [
                {icon: `mdi-home`, title: `Home`, url: `/`},
                {icon: `mdi-pen`, title: `Blog`, url: `/blog`},
                {icon: `mdi-camera`, title: `Fotos`, url: `/photos`},
            ],
            guestLinks: [
                {icon: `mdi-home`, title: `Accede a Adifia`, url: `/auth/signin`},
                {icon: `mdi-home`, title: `Registrate en Adifia`, url: `/auth/signup`},
            ],
        }
    },
    computed: {
        ...mapGetters(`auth`, [`userLinks`]),
    },
}
</script>
<style lang="scss">
.alertify-notifier {
    font-size: 20.2px;
}
</style>
