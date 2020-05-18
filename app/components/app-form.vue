<template>
  <v-form ref="form">
    <slot
      v-if="response"
      name="notifier"
      :response="response"
    >
      <v-alert
        v-if="response && response.status >= 400"
        text
        transition="scale-transition"
        outlined
        color="red accent-4"
      >
        <p class="red--text font-weight-bold">
          {{ alert.message }}
        </p>
        <v-list v-if="response.status === 422">
          <v-list-item
            v-for="(error, index) in response.data.errors"
            :key="index"
          >
            <v-list-item-title>{{ error.msg }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-alert>
      <v-alert
        v-if="response && response.status < 400"
        text
        transition="scale-transition"
        outlined
      >
        <p class="font-weight-bold">
          Todo ha ido correctamente
        </p>
      </v-alert>
    </slot>
    <slot />
    <div class="d-flex justify-space-between">
      <div>
        <v-btn
          v-if="textCancel"
          text
          @click="$emit('cancel')"
        >
          {{ textCancel }}
        </v-btn>
      </div>
      <div>
        <v-btn
          color="primary"
          @click="submit"
        >
          {{ textSubmit }}
        </v-btn>
      </div>
    </div>
  </v-form>
</template>
<script>
export default {
    props: {
        request: {
            type: Object,
            default: null,
        },
        prerequest: {
            type: Function,
            default: null,
        },
        scrollel: {
            type: Object,
            default: null,
        },
        textSubmit: {
            type: String,
            default: ``,
        },
        textCancel: {
            type: String,
            default: ``,
        },
    },
    data() {
        return {
            response: null,
        }
    },
    computed: {
        alert() {
            const message = (this.response.data.isBoom && this.response.data.output.payload.message) ||
                this.response.data.message || this.response.data || this.defaultMessage
            return {
                type: this.response.status < 400 ? `success` : `error`,
                message: message,
            }
        },
        defaultMessage() {
            return this.response.status === 200 ? `Todo ha ido bien` :
                this.response.status === 201 ? `El elemento se ha creado correctamente` :
                    this.response.status === 422 ? `Has rellenado mal el formulario` :
                        `Formulario enviado`
        },
    },
    methods: {
        async submit(preRequest = true) {
            if (!this.$refs[`form`].validate()) {
                return this.$emit(`notValid`)
            }
            const endRequest = async () => {
                try {
                    const r = await this.axiosRequest(this.request)
                    this.response = r
                    this.message = `Todo ha ido bien`
                    this.status = r.status || 200
                    this.$emit(`success`, r)
                } catch (error) {
                    alertify.error(`Hay algunos errores...`)
                    this.response = error.response
                    this.$emit(`failed`, error)
                }
            }
            this.prerequest && preRequest ? this.prerequest(endRequest) : endRequest()
        },
    },
}
</script>
