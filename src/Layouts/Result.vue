<template>
  <div class="result">
    <canvas ref="result" />
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },

    methods: {
      
    }
  }
</script>

<style lang='scss' scoped>
  @import "../styles/global";

  .result {
    width: 100%;
    height: 100%;
    @include center;
  }

</style>
