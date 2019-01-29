<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text>
      <label
        class="openArea"
        :for="inImg[0].id"
        v-if="!imgsrc[0]"
        @drop.prevent="onDrop(0, $event)"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <v-icon>photo</v-icon>
        <div class="text">
          {{ message.open[0] }}
        </div>
      </label>
      <input
        :id="inImg[0].id"
        :name="inImg[0].name"
        :ref="inImg[0].id"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile(0)"
      >
      <v-img
        class="imgArea" 
        :src="imgsrc[0]"
        v-if="imgsrc[0]"
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
            @click="closeThumb(0)"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-img>
    </v-card-text>
    <v-card-text>
      <label
        class="openArea"
        :for="inImg[1].id"
        v-if="!imgsrc[1]"
        @drop.prevent="onDrop(1, $event)"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <v-icon>photo</v-icon>
        <div class="text">
          {{ message.open[1] }}
        </div>
      </label>
      <input
        :id="inImg[1].id"
        :name="inImg[1].name"
        :ref="inImg[1].id"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile(1)"
      >
      <v-img
        class="imgArea" 
        :src="imgsrc[1]"
        v-if="imgsrc[1]"
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
            @click="closeThumb(1)"
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
          open: ['Click or Drag to Open Image 1', 'Click or Drag to Open Image 2'],
          apply: 'apply',
          cancel: 'cancel'
        },
        inImg: [
          {id: 'openFaceFile1', name: 'file1'},
          {id: 'openFaceFile2', name: 'file2'}
        ],
        imgsrc: [undefined, undefined]
      }
    },

    methods: {
      openFile (index) {
        let fileObj = index ? this.$refs.openFaceFile2.files : this.$refs.openFaceFile1.files
        let file = fileObj[0]
        openimage(file).then((imgUrl) => {
          this.imgsrc.splice(index, 1, imgUrl)
        })
      },

      async processImage () {
        let inImage1 = new Image()
        let inImage2 = new Image()
        if (this.imgsrc[0] && this.imgsrc[1]) {
          inImage1.src = this.imgsrc[0]
          inImage2.src = this.imgsrc[1]
          await faceRec(inImage1, inImage2)
        } else {
          this.$emit('showSnack', 'Error: Image or Model not loaded')
        }
      },

      closeThumb (index) {
        this.imgsrc.splice(index, 1, undefined)
        if (index) {
          this.$refs.openFaceFile2.value = ''
        } else {
          this.$refs.openFaceFile1.value = ''
        }
      },

      onDragover () {
        this.dragover = true
      },

      onDrop (index, event) {
        this.dragover = false
        if (index) {
          this.$refs.openFaceFile2.files = event.dataTransfer.files
        } else {
          this.$refs.openFaceFile1.files = event.dataTransfer.files
        }
      },
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
