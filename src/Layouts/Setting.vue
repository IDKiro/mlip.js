<template>
  <v-list style="padding: 0;">
    <vue-scroll style="height: 100vh;">
      <v-img :src="titleImg">
        <v-layout 
          align-end 
          justify-end 
          fill-height
          class="lightbox"
        >
          <v-flex shrink>
            <v-btn
              flat
              icon
              color="grey darken-1"
              href="https://github.com/IDKiro/mlip.js"
            >
              <v-icon color="white">
                icon-github
              </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-img>
      <v-list-group prepend-icon="style">
        <v-list-tile slot="activator">
          <v-list-tile-title>Style Transfer</v-list-tile-title>
        </v-list-tile>
        <Style
          @showSnack="showSnack"
        />
      </v-list-group>
      <v-list-group prepend-icon="icon-detection">
        <v-list-tile slot="activator">
          <v-list-tile-title>Object Detection</v-list-tile-title>
        </v-list-tile>
        <Object
          @showSnack="showSnack"
        />
      </v-list-group>
      <v-list-group prepend-icon="face">
        <v-list-tile slot="activator">
          <v-list-tile-title>Face Recognition</v-list-tile-title>
        </v-list-tile>
        <Face
          @showSnack="showSnack"
        />
      </v-list-group>
    </vue-scroll>
  </v-list>
</template>

<script>
  import Object from '../components/Object'
  import Face from '../components/Face'
  import Style from '../components/Style'

  export default {
    components: {
      Object,
      Face,
      Style
    },
    data () {
      return {
        titleImg: require('../assets/imgs/networks.png')
      }
    },

    methods: {
      showSnack (val) {
        this.$emit('showSnack', val)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../styles/global";

  .lightbox {
    box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
  }
</style>
