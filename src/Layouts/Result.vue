<template>
  <div class="result">
    <canvas 
      class="canvas"
      ref="canvas"
    />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        ratio: 1
      }
    },

    methods: {
      
    },

    computed: {
      objImg () {
        return this.$store.state.objImg
      },

      boxes () {
        return this.$store.state.boxes
      },

      styleImg () {
        return this.$store.state.styleImg
      }
    },

    watch: {
      objImg: function (val) {
        this.$refs.canvas.height = val.height
        this.$refs.canvas.width = val.width
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.drawImage(val, 0, 0)
      },

      boxes: function (val) {
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.font = "20px Arial"
        ctx.strokeStyle = "#FFFFFF"
        ctx.fillStyle = "#FFFFFF"
        val.forEach(box => {
          let {
            left, top, width, height, name, prob,
          } = box
          ctx.beginPath()
          ctx.rect(left, top, width, height)
          ctx.stroke()
          ctx.fillText(`${name}: ${prob}`, left + 5, top + 20)
        })
      },

      styleImg: function (val) {
        this.$refs.canvas.height = val.height
        this.$refs.canvas.width = val.width
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.putImageData(val, 0, 0)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../styles/global";

  .result {
    @include center;
    width: calc(100% - 333px);
    height: 100vh;
    .canvas {
      max-width: 90%;
      max-height: 90%;
    }
  }

</style>
