<template>
  <v-autocomplete
    v-model="user"
    :placeholder="placeholder"
    hide-no-data
    hide-selected
    :items="users"
    item-text="desc"
    item_value="_id"
    :search-input.sync="qUser"
    :loading="loading"
    return-object
  >
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title>{{ data.item.name }} {{ data.item.surname }}</v-list-item-title>
        <v-list-item-subtitle>{{ data.item.dni }} - {{ data.item.email }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
import lodash from "lodash"

export default {
    props: {
        placeholder: {
            type: String,
            default: ``,
        },
    },
    data() {
        return {
            user: null,
            qUser: ``,
            loading: false,
            users: [],
        }
    },
    watch: {
        'user'() {
            const args = {
                adminType: this.$el.dataset.admintype,
                user: this.user,
            }
            this.$emit(`user-selected`, args)
        },
        'qUser': lodash.debounce(function(newv, oldv) {
            if (newv === ``) {
                return
            }
            this.searchUsers() // eslint-disable-line no-invalid-this
        }, 500),
    },
    methods: {
        async searchUsers() {
            this.loading = true
            const response = await this.axiosRequest({
                url: `/users/searchUser?query=` + this.qUser,
                method: `get`,
            })
            this.users = response.data
            this.loading = false
        },
    },
}
</script>
