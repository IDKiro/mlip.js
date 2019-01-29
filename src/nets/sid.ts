/* eslint-disable */

import * as tf from '@tensorflow/tfjs'

const sidProcess = async (image: Uint16Array, model: tf.Model) => {
    console.log(image, model)
}

export { sidProcess } 