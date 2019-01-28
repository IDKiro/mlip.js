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
      }
    },

    watch: {
      objImg: function (val) {
        const DEFAULT_INPUT_DIM = 416
        this.$refs.canvas.height = val.height
        this.$refs.canvas.width = val.width
        this.ratio = Math.max(
          Math.max(val.height / DEFAULT_INPUT_DIM, val.width / DEFAULT_INPUT_DIM),
          1)
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.drawImage(val, 0, 0)
      },

      boxes: function (val) {
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.scale(this.ratio, this.ratio)
        val.forEach(box => {
          const {
            top, left, bottom, right, classProb, className,
          } = box
          if (this.objImg.height / this.ratio >= bottom &
            this.objImg.width / this.ratio >= right) {
            ctx.beginPath()
            ctx.rect(left, top, right-left, bottom-top)
            ctx.stroke()
            ctx.strokeText(`${className} ${classProb}`, left, bottom)
          }
        })
        ctx.scale(1 / this.ratio, 1 / this.ratio)
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
