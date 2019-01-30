<template>
  <v-card
    flat
    color="transparent"
  >
    <v-card-text
      v-for="(item, index) in inImg"
      :key="item.id"
    >
      <v-subheader class="pl-0">
        {{ message.imageName[index] }}
      </v-subheader>
      <v-btn
        flat
        icon
        small
        color="grey darken-4"
        @click="ifOpen = !ifOpen"
        style="position: absolute;"
        v-if="index === 1"
      >
        <v-icon>swap_horiz</v-icon>
      </v-btn>
      <label
        class="openArea"
        :for="item.id"
        v-if="!imgsrc[index] && (index === 0 || ifOpen)"
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
        ref="openStyleFile"
        type="file" 
        accept="image/*"
        v-show="false"
        @change="openFile(index)"
      >
      <v-img
        class="imgArea"
        :aspect-ratio="3/2"
        :src="gallery[galleryIndex]"
        v-if="index === 1 && !ifOpen"
      >
        <v-layout
          fill-height
          align-center
          justify-space-between
        >
          <v-btn
            flat
            icon
            color="blue"
            @click="back()"
          >
            <v-icon large>
              keyboard_arrow_left
            </v-icon>
          </v-btn>
          <v-btn
            flat
            icon
            color="blue"
            @click="forward()"
          >
            <v-icon large>
              keyboard_arrow_right
            </v-icon>
          </v-btn>
        </v-layout>
      </v-img>
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
      <v-subheader class="pl-0">
        {{ message.style }}
      </v-subheader> 
      <v-slider
        v-model="strength"
        min="0"
        max="100"
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
        <v-btn
          color="error"
          @click="clearAll()"
        >
          {{ message.cancel }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { openimage } from '../utils/image'
  import { styleTrans } from '../nets/style'

  export default {
    data () {
      return {
        message: {
          imageName: ['Origin image', 'Style image'],
          style: 'Stylization strength',
          apply: 'apply',
          cancel: 'cancel'
        },
        inImg: [
          {id: 'openStyleFile1', name: 'file1', message: 'Click or Drag to Open'},
          {id: 'openStyleFile2', name: 'file2', message: 'Click or Drag to Open'}
        ],
        ifOpen: true,
        gallery: [
          'images/style/bricks.jpg',
          'images/style/clouds.jpg',
          'images/style/red_circles.jpg',
          'images/style/seaport.jpg',
          'images/style/sketch.jpg',
          'images/style/stripes.jpg',
          'images/style/towers.jpg',
          'images/style/udnie.jpg',
          'images/style/zigzag.jpg',
          ],
        galleryIndex: 0,
        strength: 100,
        imgsrc: [undefined, undefined]
      }
    },

    methods: {
      openFile (index) {
        let fileObj = this.$refs.openStyleFile[index].files
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
          this.$store.commit('setStyleImg', await styleTrans(inImage1, inImage2, this.strength))
        } else {
          this.$emit('showSnack', 'Error: Image not loaded')
        }
      },

      clearAll () {
        this.imgsrc = [undefined, undefined]
        this.strength = 100
        this.$refs.openStyleFile[0].value = ''
        this.$refs.openStyleFile[1].value = ''
      },

      closeThumb (index) {
        this.imgsrc.splice(index, 1, undefined)
        this.$refs.openStyleFile[index].value = ''
      },

      back () {
        if (this.galleryIndex === 0) {
          this.galleryIndex = this.gallery.length
        } else {
          this.galleryIndex = this.galleryIndex - 1
        }
      },

      forward () {
        if (this.galleryIndex === (this.gallery.length - 1)) {
          this.galleryIndex = 0
        } else {
          this.galleryIndex = this.galleryIndex + 1
        }
      },

      onDragover () {
        this.dragover = true
      },

      onDrop (index, event) {
        this.dragover = false
        this.$refs.openStyleFile[index].files = event.dataTransfer.files
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
