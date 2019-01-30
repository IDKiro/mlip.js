/* eslint-disable */

import * as tf from '@tensorflow/tfjs'

const STYLE_MODEL_DIR = [
  'models/style/style/tensorflowjs_model.pb',
  'models/style/style/weights_manifest.json'
]

const TRANSFER_MODEL_DIR = [
  'models/style/transfer/tensorflowjs_model.pb',
  'models/style/transfer/weights_manifest.json'
]

const loadStyleModel = async () => {
  let styleNet = await tf.loadFrozenModel(
    STYLE_MODEL_DIR[0], 
    STYLE_MODEL_DIR[1]
    )
  return styleNet
}

const loadTransferModel = async () => {
  let transferNet = await tf.loadFrozenModel(
    TRANSFER_MODEL_DIR[0], 
    TRANSFER_MODEL_DIR[1]
    )
  return transferNet
}

const styleTrans = async (image1: ImageData, image2: ImageData, strenth: number) => {
  const styleNet = await loadStyleModel()
  const transferNet = await loadTransferModel()
  console.log(styleNet, transferNet)
}

export { styleTrans } 