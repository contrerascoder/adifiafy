<template>
  <div>
    <slot v-if="authed" />
    <slot
      v-else
      name="not-authed"
    >
      <v-container>
        <v-row
          justify="center"
          align="center"
        >
          <v-col>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">
                    Usted esta en una zona no autorizada
                  </h3>
                </div>
              </v-card-title>
              <v-card-text>
                <p>Debe de irse</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </slot>
  </div>
</template>
<script>
export default {
    props: {
        profile: {
            type: String,
            default: ``,
        },
    },
    computed: {
        authed() {
            if (!this.token) {
                return false
            }
            return this.userData.profiles[this.profile] !== null
        },
    },
}
</script>
