<template>
  <svg
    :width="100 * factor"
    :height="100 * factor"
  >
    <defs>
      <radialGradient
        id="grad1"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop
          offset="0%"
          style="stop-color:rgb(255,255,255);stop-opacity:0"
        />
        <stop
          offset="100%"
          style="stop-color:rgb(0,0,255);stop-opacity:1"
        />
      </radialGradient>
    </defs>
    <circle
      :cx="50 * factor"
      :cy="50 * factor"
      :r="45 * factor"
      fill="transparent"
      stroke="blue"
      :stroke-width="2 * factor"
    />
    <rect
      :x="10 * factor"
      :y="10 * factor"
      :width="80 * factor"
      :height="80 * factor"
      fill="transparent"
      stroke="black"
      :stroke-width="2 * factor"
    />
    <ellipse
      :cx="50 * factor"
      :cy="50 * factor"
      :rx="30 * factor"
      :ry="30 * factor"
      fill="url(#grad1)"
    />
  </svg>
</template>
<script>
export default {
    props: {
        factor: {
            type: Number,
            default: 1,
        },
    },
}
</script>
