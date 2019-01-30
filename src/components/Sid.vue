<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text>
      <label
        class="openArea"
        for="openRawFile"
        v-if="!thumbsrc"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <v-icon>photo</v-icon>
        <div class="text">
          {{ message.open }}
        </div>
      </label>
      <input
        id="openRawFile"
        name="file"
        ref="openRawFile"
        type="file" 
        accept=".arw, .cr2"
        v-show="false"
        @change="openRawFile"
      >
      <v-img
        class="imgArea"
        :aspect-ratio="3/2"
        :src="thumbsrc"
        v-if="thumbsrc"
      >
        <v-layout
          fill-height
          align-start
          justify-end
        >
          <v-btn
            flat
            icon
            small
            color="blue"
            @click="closeThumb()"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-img>
    </v-card-text>
    <v-card-text>
      <v-subheader class="pl-0">
        {{ message.dark }}
      </v-subheader> 
      <v-slider
        v-model="darkLevel"
        min="128"
        max="896"
        step="128"
        ticks="always"
        tick-size="2"
        thumb-label
      />
    </v-card-text>
    <v-card-text>
      <v-subheader class="pl-0">
        {{ message.ratio }}
      </v-subheader> 
      <v-slider
        v-model="gammaRatio"
        min="100"
        max="500"
        step="50"
        ticks="always"
        tick-size="2"
        thumb-label
      />
    </v-card-text>
    <v-card-text>
      <v-layout
        row
        align-center
        justify-space-around
      >
        <v-btn
          color="success"
          @click="processImage()"
        >
          {{ message.apply }}
        </v-btn>
        <v-btn color="error">
          {{ message.cancel }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { openraw } from '../utils/raw'
  import { sidProcess } from '../nets/sid'

  export default {
    data () {
      return {
        darkLevel: 512,
        gammaRatio: 300,
        message: {
          open: 'Click or Drag to Open',
          dark: 'Dark Level',
          ratio: 'Gamma Ratio',
          apply: 'apply',
          cancel: 'cancel'
        },
        thumbsrc: undefined
      }
    },

    methods: {
      openRawFile () {
        let fileObj = this.$refs.openRawFile.files
        let file = fileObj[0]
        openraw(file).then((thumbUrl) => {
          this.thumbsrc = thumbUrl
        })
      },

      async processImage () {
        let rawImage = new Uint16Array()
        if (this.thumbsrc) {
          await sidProcess(rawImage)
        } else {
          this.$emit('showSnack', 'Error: Image not loaded')
        }
      },

      closeThumb () {
        this.thumbsrc = undefined
        this.$refs.openRawFile.value = ''
      },

      onDragover () {
        this.dragover = true
      },

      onDrop (event) {
        this.dragover = false
        this.$refs.openRawFile.files = event.dataTransfer.files
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../styles/global";

  .openArea {
    @include center;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    height: 200px; 
    width: 300px;
    background: #fff;
    .text {
      color: #515a6e;
      font-size: 16px;
    }
  }

  .imgArea {
    border-radius: 6px;
    width: 300px;
  }

  .text-label {
    margin: 10px;
    font-size: 16px;
  }
</style>
