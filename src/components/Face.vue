<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text>
      <label
        class="openArea"
        for="openfile"
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
        id="openfile"
        name="file"
        ref="openFaceFile"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile"
      >
      <v-img
        class="imgArea" 
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
            @click="closeThumb"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-img>
    </v-card-text>
    <v-card-text>
      <v-layout
        row
        align-center
        justify-space-around
      >
        <v-btn
          color="success"
          @click="processImage"
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
  import { openimage } from '../utils/image'
  import { faceRec } from '../nets/face'

  export default {
    data () {
      return {
        message: {
          open: 'Click or Drag to Open',
          apply: 'apply',
          cancel: 'cancel'
        },
        thumbsrc: undefined
      }
    },

    methods: {
      openFile () {
        let fileObj = this.$refs.openFaceFile.files
        let file = fileObj[0]
        openimage(file).then((imgUrl) => {
          this.thumbsrc = imgUrl
        })
      },

      processImage () {
        let inImage = new Image()
        if (this.thumbsrc) {
          inImage.src = this.thumbsrc
          faceRec(inImage)
        } else {
          throw new Error('image not loaded')
        }
      },

      closeThumb () {
        this.thumbsrc = undefined
        this.$refs.openFaceFile.value = ''
      },

      onDragover () {
        if (!this.disabled) {
          this.dragover = true
        }
      },

      onDrop (event) {
        this.dragover = false
        this.$refs.openFaceFile.files = event.dataTransfer.files
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

</style>
