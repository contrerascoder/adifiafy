<template>
  <remote-data
    v-model="users"
    url="/users"
  >
    <template v-slot:data>
      <v-data-table
        :headers="headers"
        :items="users"
      >
        <template v-slot:item.operations="{item}">
          <div class="d-flex justify-end">
            <template v-if="item.banned">
              <v-btn
                text
                small
                color="error"
                @click="() => unbanUser(item)"
              >
                Desbanear
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                text
                small
                color="error"
                @click="() => banUser(item)"
              >
                Banear
              </v-btn>
            </template>
            <v-btn
              :to="'/admin/users/' + item._id"
              text
              small
              color="primary"
            >
              Ver detalles
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </template>
  </remote-data>
</template>

<script>
import lodash from 'lodash'
export default {
    data() {
        return {
            users: [],
            headers: [
                {value: `name`, text: `Nombre`},
                {value: `surname`, text: `Apellidos`},
                {value: `dni`, text: `DNI`},
                {value: `phone`, text: `Phone`},
                {value: `operations`, text: `Operaciones`},
            ],
        }
    },
    methods: {
        async banUser(user) {
            try {
                await this.axiosRequest({
                    url: `/users/ban/` + user._id,
                    method: `put`,
                })
                const index = lodash.findIndex(this.users, {_id: user._id})
                this.users[index].banned = true
                this.notify(`success`, `El usuario fue baneado`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
        async unbanUser(user) {
            try {
                await this.axiosRequest({
                    url: `/users/unban/` + user._id,
                    method: `put`,
                })
                const index = lodash.findIndex(this.users, {_id: user._id})
                this.users[index].banned = false
                this.notify(`success`, `El usuario fue des  baneado`)
            } catch (error) {
                this.notify(`error`, `Algo malo sucedio`)
            }
        },
    },
}
</script>
