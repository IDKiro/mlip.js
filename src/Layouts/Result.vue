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
        this.ratio = Math.max(val.height / DEFAULT_INPUT_DIM, val.width / DEFAULT_INPUT_DIM)
        let ctx = this.$refs.canvas.getContext("2d")
        ctx.drawImage(val, 0, 0)
      },

      boxes: function (val) {
        let ctx = this.$refs.canvas.getContext("2d")
        val.forEach(box => {
          const {
            top, left, bottom, right, classProb, className,
          } = box
          ctx.beginPath()
          ctx.rect(left * this.ratio, top * this.ratio, (right-left) * this.ratio, (bottom-top) * this.ratio)
          ctx.stroke()
          ctx.strokeText(`${className} ${classProb}`, left * this.ratio, top * this.ratio)
        })
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
