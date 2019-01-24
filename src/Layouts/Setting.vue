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
              href="https://github.com/IDKiro"
            >
              <v-icon>icon-github</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-img>
      <v-divider />
      <v-list-group prepend-icon="icon-detection">
        <v-list-tile slot="activator">
          <v-list-tile-title>Object Detection</v-list-tile-title>
        </v-list-tile>
        <Object />
      </v-list-group>
      <v-list-group prepend-icon="icon-raw">
        <v-list-tile slot="activator">
          <v-list-tile-title>See in the dark</v-list-tile-title>
        </v-list-tile>
        <Sid />
      </v-list-group>
    </vue-scroll>
  </v-list>
</template>

<script>
  import Object from '../components/Object'
  import Sid from '../components/Sid'

  export default {
    components: {
      Object,
      Sid
    },
    data () {
      return {
        titleImg: require('../assets/imgs/networks.png')
      }
    },

    methods: {
    }
  }
</script>

<style lang='scss' scoped>
  @import "../styles/global";
</style>
