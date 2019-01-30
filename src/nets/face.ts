/* eslint-disable */

import * as tf from '@tensorflow/tfjs'

const faceRec = async (
  image1: ImageData | HTMLImageElement | HTMLCanvasElement, 
  image2: ImageData | HTMLImageElement | HTMLCanvasElement, 
  model: tf.Model
  ) => {
  console.log(image1, image2, model)
}

export { faceRec } 