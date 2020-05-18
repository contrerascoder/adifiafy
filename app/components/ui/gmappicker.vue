<template>
  <div>
    <div
      id="map"
      ref="map"
    />
  </div>
</template>
<script>
export default {
    mounted() {
        /* const map = new google.maps.Map(this.$refs.map, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
        })*/
    },
}
</script>
<style scoped>
#map {
    min-height: 200px;
}
</style>
