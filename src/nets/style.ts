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

const startStyling = async (
  contentImg: ImageData, 
  styleImg: ImageData, 
  styleNet: tf.FrozenModel, 
  transformNet: tf.FrozenModel, 
  styleRatio: number
  ) => {
  const stylized = await tf.tidy(() => {
    let bottleneck = styleNet.predict(
      tf.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims()
      ) as tf.Tensor<tf.Rank>
    if (styleRatio !== 1.0) {
      const identityBottleneck = styleNet.predict(
        tf.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims()
        ) as tf.Tensor<tf.Rank>
      const styleBottleneck = bottleneck
      const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio))
      const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-styleRatio))
      bottleneck = styleBottleneckScaled.addStrict(identityBottleneckScaled) as tf.Tensor<tf.Rank>
    }
    const stylizedTensor = transformNet.predict([tf.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]) as tf.Tensor<tf.Rank>
    return stylizedTensor.squeeze()
  })
  return stylized as tf.Tensor<tf.Rank.R2>
}

const styleTrans = async (contentImg: ImageData, styleImg: ImageData, strenth: number) => {
  const styleNet = await loadStyleModel()
  const transferNet = await loadTransferModel()
  const styleRatio = strenth / 100
  let stylized = await startStyling(contentImg, styleImg, styleNet, transferNet, styleRatio)
  let canvas = document.createElement("CANVAS") as HTMLCanvasElement
  let ctx = canvas.getContext("2d")
  await tf.toPixels (stylized, canvas)
  if (ctx) {
    return ctx.getImageData(0, 0, contentImg.width, contentImg.height)
  } else {
    return new Error('error')
  }
}

export { styleTrans } 