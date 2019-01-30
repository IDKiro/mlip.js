<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text
      v-for="(item, index) in inImg"
      :key="item.id"
    >
      <label
        class="openArea"
        :for="item.id"
        v-if="!imgsrc[index]"
        @drop.prevent="onDrop(index, $event)"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <v-icon>photo</v-icon>
        <div class="text">
          {{ item.message }}
        </div>
      </label>
      <input
        :id="item.id"
        :name="item.name"
        ref="openFaceFile"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile(index)"
      >
      <v-img
        class="imgArea" 
        :src="imgsrc[index]"
        v-if="imgsrc[index]"
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
            @click="closeThumb(index)"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-img>
    </v-card-text>
    <v-card-text>
      <v-select
        :items="models"
        v-model="selModel"
        label="Select model"
        @change="loadModel"
        :append-icon="modelLoaded ? 'done' : '$vuetify.icons.dropdown'"
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
  import { loadFrozenModel } from '@tensorflow/tfjs-converter'
  import { openimage } from '../utils/image'
  import { faceRec } from '../nets/face'

  export default {
    data () {
      return {
        message: {
          apply: 'apply',
          cancel: 'cancel'
        },
        inImg: [
          {id: 'openFaceFile1', name: 'file1', message: 'Click or Drag to Open Image 1'},
          {id: 'openFaceFile2', name: 'file2', message: 'Click or Drag to Open Image 2'}
        ],
        imgsrc: [undefined, undefined],
        models: [
          {text: 'Default', value: ['models/face/tensorflowjs_model.pb', 'models/face/weights_manifest.json']}
        ],
        modelLoaded: false,
        selModel: undefined,
        loadedModel: undefined
      }
    },

    methods: {
      openFile (index) {
        let fileObj = this.$refs.openFaceFile[index].files
        let file = fileObj[0]
        openimage(file).then((imgUrl) => {
          this.imgsrc.splice(index, 1, imgUrl)
        })
      },

      async loadModel (evt) {
        this.modelLoaded = false
        this.loadedModel = await loadFrozenModel(evt[0], evt[1])
        this.modelLoaded = true
      },

      async processImage () {
        let inImage1 = new Image()
        let inImage2 = new Image()
        if (this.imgsrc[0] && this.imgsrc[1] && this.loadedModel) {
          inImage1.src = this.imgsrc[0]
          inImage2.src = this.imgsrc[1]
          await faceRec(inImage1, inImage2, this.loadedModel)
        } else {
          this.$emit('showSnack', 'Error: Image or Model not loaded')
        }
      },

      closeThumb (index) {
        this.imgsrc.splice(index, 1, undefined)
        this.$refs.openFaceFile[index].value = ''
      },

      onDragover () {
        this.dragover = true
      },

      onDrop (index, event) {
        this.dragover = false
        this.$refs.openFaceFile[index].files = event.dataTransfer.files
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
