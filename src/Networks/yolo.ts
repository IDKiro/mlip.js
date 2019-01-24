import * as tf from '@tensorflow/tfjs'

const yoloProcess = (image: ImageData) => {
  let inputTensor = tf.fromPixels(image)
  
}

export { yoloProcess } 
