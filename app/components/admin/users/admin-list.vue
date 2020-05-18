<template>
  <remote-data
    v-model="admins"
    url="/users/admins"
  >
    <template v-slot:data>
      <v-simple-table>
        <thead>
          <tr>
            <th>Tipo de administrador</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Administrador</td>
            <td>
              <user-selecter
                data-adminType="administrator"
                :placeholder="getPlaceholderFor('administrator')"
                @user-selected="processSelection"
              />
            </td>
          </tr>
          <tr>
            <td>Tesorero</td>
            <td>
              <user-selecter
                data-adminType="treasurer"
                :placeholder="getPlaceholderFor('treasurer')"
                @user-selected="processSelection"
              />
            </td>
          </tr>
          <tr>
            <td>Secretario</td>
            <td>
              <user-selecter
                data-adminType="secretary"
                :placeholder="getPlaceholderFor('secretary')"
                @user-selected="processSelection"
              />
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </template>
  </remote-data>
</template>

<script>
import UserSelecter from "./user-selecter"
const adminsType = {
    administrator: `administrador`,
    treasurer: `tesorero`,
    secretary: `secretario`,
}
export default {
    components: {UserSelecter},
    data() {
        return {
            adminsData: null,
        }
    },
    computed: {
        admins: {
            get() {
                return this.adminsData
            },
            set(value) {
                const admins = {}
                for (let index = 0; index < value.length; index++) {
                    const element = value[index]
                    admins[element.typeAdmin] = element.user
                }
                this.adminsData = admins
            },
        },
    },
    methods: {
        async processSelection({user, adminType}) {
            await this.axiosRequest({
                method: `post`,
                url: `/users/overrideAdmin/${adminType}`,
                data: user,
            })
            this.adminsData[adminType] = user
            this.notify(`success`, `El ${adminsType[adminType]} fue cambiado`)
        },
        getPlaceholderFor(type) {
            return this.adminsData[type] && `${this.adminsData[type].name} ${this.adminsData[type].surname}` || `No establecido`
        },
    },
}
</script>
