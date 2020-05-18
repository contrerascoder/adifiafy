<template>
  <v-card outlined>
    <v-card-text>
      <app-form
        :request="photoRequest"
        text-submit="Subir"
        text-cancel="Volver"
        @success="successPhotoUpload"
        @cancel="$router.push(&quot;/photos&quot;)"
      >
        <template v-slot:notifier="{response}" />
        <v-container>
          <v-row>
            <v-col :cols="4">
              <picture-field v-model="form.photo" />
            </v-col>
            <v-col :cols="8">
              <v-text-field
                v-model="form.title"
                placeholder="Título de la foto"
              />
              <v-textarea
                v-model="form.body"
                placeholder="Descripcion de la foto"
              />
            </v-col>
          </v-row>
        </v-container>
      </app-form>
    </v-card-text>
  </v-card>
</template>

<script>
import PictureField from "../ui/picture-field"
export default {
    components: {PictureField},
    data() {
        return {
            form: {
                title: ``,
                body: ``,
                photo: null,
            },
        }
    },
    computed: {
        photoRequest() {
            return this.$route.query.id ? {} : {
                method: `post`,
                url: `/photos`,
                data: this.fd,
            }
        },
        fd() {
            const fd = new FormData()
            fd.append(`title`, this.form.title)
            fd.append(`body`, this.form.body)
            fd.append(`photo`, this.form.photo)
            return fd
        },
    },
    beforeDestroy() {
        this.form.title = ``
        this.form.body = ``
        this.form.photo = null
    },
    methods: {
        async successPhotoUpload() {
            try {
                this.notify(`success`, `La foto se mando correctamente`)
                this.$router.push(`/photos`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
    },
}
</script>
