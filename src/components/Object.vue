<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text>
      <label
        class="openArea"
        for="openObjectFile"
        v-if="!imgsrc"
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
        id="openObjectFile"
        name="file"
        ref="openObjectFile"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile"
      >
      <v-img
        class="imgArea" 
        :src="imgsrc"
        v-if="imgsrc"
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
          @click="processImage"
        >
          {{ message.apply }}
        </v-btn>
        <v-btn
          color="error"
          @click="clearAll"
        >
          {{ message.cancel }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import * as tf from '@tensorflow/tfjs'
  import { openimage } from '../utils/image'
  import { objDet } from '../nets/object'

  export default {
    data () {
      return {
        message: {
          open: 'Click or Drag to Open',
          apply: 'apply',
          cancel: 'cancel'
        },
        imgsrc: undefined,
        models: [
          {text: 'Yolo v2', value: 'models/object/model.json'}
        ],
        modelLoaded: false,
        selModel: undefined,
        loadedModel: undefined
      }
    },

    methods: {
      openFile () {
        let fileObj = this.$refs.openObjectFile.files
        let file = fileObj[0]
        openimage(file).then((imgUrl) => {
          this.imgsrc = imgUrl
        })
      },

      async loadModel (evt) {
        this.modelLoaded = false
        this.loadedModel = await tf.loadModel(evt)
        this.modelLoaded = true
      },

      async processImage () {
        let inImage = new Image()
        if (this.imgsrc && this.loadedModel) {
          inImage.src = this.imgsrc
          this.$store.commit('setObjImg', inImage)
          this.$store.commit('setBoxes', await objDet(inImage, this.loadedModel))
        } else {
          this.$emit('showSnack', 'Error: Image or Model not loaded')
        }
      },

      clearAll () {
        this.imgsrc = undefined
        this.modelLoaded = false
        this.selModel = undefined
        this.loadedModel = undefined
      },

      closeThumb () {
        this.imgsrc = undefined
        this.$refs.openObjectFile.value = ''
      },

      onDragover () {
        this.dragover = true
      },

      onDrop (event) {
        this.dragover = false
        this.$refs.openObjectFile.files = event.dataTransfer.files
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
