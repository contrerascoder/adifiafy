<template>
  <v-container
    transition="slide-x-transition"
    grid-list-xs
  >
    <v-slide-x-transition
      ref="container"
      class="photos-container py-0"
      group
      tag="div"
    >
      <template
        v-for="(photo) in photoList"
        :cols="4"
      >
        <div
          :key="photo._id"
          :cols="4"
        >
          <photo-item
            :id="photo.id"
            :photo="photo"
          />
        </div>
      </template>
    </v-slide-x-transition>
  </v-container>
</template>
<script>
import PhotoItem from './photo-item.vue'

/**
 *
function inView(element, fullHeightInView) {
    const docViewTop = window.scrollTop
    const docViewBottom = docViewTop + window.height
    const elemTop = element.offset().top
    let elemBottom

    if (fullHeightInView) {
      elemBottom = elemTop + element.height()
    } else {
      elemBottom = elemTop
    }

    return ((elemBottom >= docViewTop) &&
        (elemTop <= docViewBottom) &&
        (elemBottom <= docViewBottom) &&
        (elemTop >= docViewTop))
}
*/

export default {
    components: {PhotoItem},
    props: {
        photoList: {
            type: Array,
            default: null,
        },
    },
}
</script>
<style>
@media (min-width: 768px) {
  .photos-container {
  display: grid;
  grid-gap: 20px;
    grid-template-columns: repeat(3, 32%);
  }
}
</style>
