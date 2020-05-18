<template>
  <v-dialog
    :value="true"
    @click:outside="$router.push('/photos')"
  >
    <v-card>
      <v-card-title>Envia una foto a foto denuncia</v-card-title>
      <v-card-text>
        <no-ssr>
          <has-profile profile="photographer">
            <template slot="not-authed">
              <v-card
                v-if="isLogged"
                outlined
              >
                <v-card-title primary-title>
                  <div>
                    <h3 class="title">
                      Usted no tiene perfil de fotógrado
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-btn
                    text
                    small
                    color="primary"
                    @click="requestProfile"
                  >
                    Hacerme fotografo
                  </v-btn>
                </v-card-text>
              </v-card>
              <v-card
                v-else
                outlined
              >
                <v-card-title primary-title>
                  <div>
                    <h3 class="title">
                      Usted no accedió al sistema
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-btn
                    :to="'/auth/signin?backurl=' + $route.path"
                    text
                    small
                    color="primary"
                  >
                    Acceder al sistema
                  </v-btn>
                </v-card-text>
              </v-card>
            </template>
            <photo-editor />
          </has-profile>
        </no-ssr>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import PhotoEditor from "@/components/photos/photo-editor"
import {mapMutations} from "vuex"
export default {
    components: {PhotoEditor},
    head() {
        return {
            title: `Añadir foto a foto denuncia`,
        }
    },
    methods: {
        ...mapMutations(`auth`, [`addProfile`]),
        async requestProfile() {
            const r = await this.axiosRequest({
                method: `post`,
                url: `/profile/makePhotographer/`,
            })
            this.addProfile({
                profile: r.data,
                name: `photographer`,
            })
        },
    },
}
</script>
