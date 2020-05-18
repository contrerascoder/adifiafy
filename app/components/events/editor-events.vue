<template>
  <app-form
    :prerequest="prereq"
    :request="eventRequest"
    :text-submit="$route.query.id && &quot;Actualizar evento&quot; || &quot;Crear evento&quot;"
    text-cancel="Volver"
    @success="successPost"
    @cancel="$router.push(&quot;/admin/events&quot;)"
  >
    <template v-slot:notifier="{response}" />
    <v-text-field
      v-model="form.title"
      :rules="[rules.title]"
      placeholder="Título"
    />
    <v-text-field
      v-model="form.body"
      :rules="[rules.body]"
      placeholder="Descripcion"
    />
    <v-row>
      <v-col class="d-flex justify-center">
        <v-date-picker
          v-model="date.date"
          :landscape="true"
          :reactive="true"
        />
      </v-col>
      <v-col class="d-flex justify-center">
        <v-time-picker
          v-model="date.time"
          format="24hr"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-model="form.place"
      :rules="[rules.place]"
      placeholder="Lugar"
    />
  </app-form>
</template>

<script>
import moment from 'moment'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            rules: {
                title: (val) => val.length > 6 || `El titulo es muy corto`,
                body: (val) => val.length > 10 || `La descripcion es muy corta`,
                place: (val) => val.length > 10 || `El lugar es muy corto`,
            },
            date: {
                time: ``,
                date: ``,
            },
            form: {
                title: ``,
                body: ``,
                place: ``,
            },
        }
    },
    computed: {
        eventRequest() {
            const id = this.$route.query.id
            return {
                method: id && `put` || `post`,
                url: id && `/events/` + id || `/events`,
                data: {
                    ...this.form,
                    ...this.date,
                },
            }
        },
        datetime() {
            return new Date(`${this.date.date} ${this.date.time}`)
        },
    },
    async mounted() {
        try {
            const id = this.$route.query.id
            if (!id) return
            const r = await this.axiosRequest({url: `/events/` + id})
            const {title, body, place, datetime} = r.data
            this.form.title = title
            this.form.body = body
            this.form.place = place
            this.date.date = moment(datetime).format(`YYYY-MM-DD`)
            this.date.time = moment(`${datetime}`).format(`HH:mm`)
        } catch (error) {
            this.notify(`error`, `Algo malo sucedio`)
        }
    },
    methods: {
        ...mapMutations(`events`, [`add`, `edit`]),
        successPost(r) {
            const message = this.$route.query.id && `El evento se actualizó con exito` || `El evento se creo con exito`
            this.notify(`success`, message)

            if (this.$route.query.id) this.edit(r.data)
            else this.add(r.data)

            this.$router.push(`/admin/events`)
        },
        prereq(cb) {
            if (!this.date.time || !this.date.date) {
                this.notify(`error`, `La fecha no es valida`)
            } else cb()
        },
    },
}
</script>
