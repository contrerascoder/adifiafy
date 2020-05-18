<template>
  <remote-data :url="'/users/' + $route.params.id">
    <template v-slot:data="{data}">
      <user-detail
        :user="data.user"
        :profiles="data.profiles"
      />
    </template>
  </remote-data>
</template>

<script>
import UserDetail from "@/components/admin/users/user-detail"
export default {
    components: {UserDetail},
    layout: `admin`,
    head() {
        return {
            title: `Detalles del usuario`,
        }
    },
}
</script>
