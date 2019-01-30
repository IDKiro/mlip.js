/* eslint-disable */

import * as tf from '@tensorflow/tfjs'

const faceRec = async (image1: HTMLImageElement, image2: HTMLImageElement, model: tf.Model) => {
    console.log(image1, image2, model)
}

export { faceRec } 