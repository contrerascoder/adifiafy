<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">
          Administración de usuarios
        </h3>
        <div>
          <v-breadcrumbs
            divider="/"
            :items="breads"
          />
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-tabs
        v-model="activeTab"
        color="#fff"
        dark
      >
        <v-tab ripple>
          Listado de usuarios
        </v-tab>
        <v-tab ripple>
          Listado de administradores
        </v-tab>
        <v-tab-item>
          <users-table />
        </v-tab-item>
        <v-tab-item>
          <admin-list />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import UsersTable from "@/components/admin/users/users-table.vue"
import AdminList from "@/components/admin/users/admin-list"
export default {
    components: {UsersTable, AdminList},
    layout: `admin`,
    data() {
        return {
            activeTab: 0,
            breads: [
                {disabled: true, text: `Listado de usuarios`},
            ],
        }
    },
    head() {
        return {
            title: `Administración de usuarios`,
        }
    },
}
</script>
