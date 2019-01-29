/* eslint-disable */

import * as tf from '@tensorflow/tfjs'

const faceRec = async (image1: ImageData, image2: ImageData, model: tf.Model) => {
    console.log(image1, image2, model)
}

export { faceRec } 