<template>
  <v-card class="tag">
    <v-card-text>
      <h3>{{ item.name }} {{ item.disabled && ' (deshabilitado)' || '' }}</h3>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        small
        color="primary"
        @click="editTag"
      >
        Renombrar
      </v-btn>
      <v-btn
        v-if="item.disabled"
        text
        small
        color="success"
        @click="habilitateTag"
      >
        Habilitar
      </v-btn>
      <v-btn
        v-else
        text
        small
        color="error"
        @click="inhabilitateTag"
      >
        Inhabilitar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        editTag() {
            alertify.prompt(`¿Que nuevo nombre le quieres poner?`, ``, this.item.name, async (evt, value) => {
                const r = await this.axiosRequest({
                    method: `put`,
                    url: `/tags/` + this.item._id,
                    data: {
                        name: value,
                    },
                })
                this.$emit(`update-tag`, {
                    ...r.data,
                    name: value,
                })
            }, () => {
                this.notify(`success`, `Has cancelado`)
            })
        },
        async inhabilitateTag() {
            const r = await this.axiosRequest({
                method: `put`,
                url: `/tags/inhabilitate/` + this.item._id,
            })
            this.$emit(`inhabilitate-tag`, {
                ...r.data,
            })
        },
        async habilitateTag() {
            const r = await this.axiosRequest({
                method: `put`,
                url: `/tags/habilitate/` + this.item._id,
            })
            this.$emit(`habilitate-tag`, {
                ...r.data,
            })
        },
    },
}
</script>
<style>
.tag {
    margin: 10px;
}
</style>
