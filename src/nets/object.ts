import * as tf from '@tensorflow/tfjs'

const DEFAULT_INPUT_DIM = 416
const DEFAULT_MAX_BOXES = 2048
const DEFAULT_FILTER_BOXES_THRESHOLD = 0.01
const DEFAULT_IOU_THRESHOLD = 0.4
const DEFAULT_CLASS_PROB_THRESHOLD = 0.4
const DEFAULT_MODEL_LOCATION = 'models/yolo/model2.json'
const class_names = [
  'person', 'bicycle', 'car', 'motorbike', 'aeroplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
  'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle',
  'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
  'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'sofa', 'pottedplant', 'bed',
  'diningtable', 'toilet', 'tvmonitor', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
  'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush',
]

const YOLO_ANCHORS = tf.tensor2d([
  [0.57273, 0.677385], [1.87446, 2.06253], [3.33843, 5.47434],
  [7.88282, 3.52778], [9.77052, 9.16828],
])

const downloadModel = async (url = DEFAULT_MODEL_LOCATION) => {
  return await tf.loadModel(url)
}

const yolo_filter_boxes =  (
  boxes: tf.Tensor<tf.Rank>,
  box_confidence: tf.Tensor<tf.Rank>,
  box_class_probs: tf.Tensor<tf.Rank>,
  threshold: number
) => {
  const box_scores = tf.mul(box_confidence, box_class_probs)
  const box_classes = tf.argMax(box_scores, -1)
  const box_class_scores = tf.max(box_scores, -1)
  const prediction_mask = tf.greaterEqual(box_class_scores, tf.scalar(threshold)).as1D()

  const N = prediction_mask.size
  const all_indices = tf.linspace(0, N - 1, N).toInt()
  const neg_indices = tf.zeros([N], 'int32')
  const indices = tf.where(prediction_mask, all_indices, neg_indices) as tf.Tensor<tf.Rank.R1>

  return [
    tf.gather(boxes.reshape([N, 4]), indices),
    tf.gather(box_class_scores.flatten(), indices),
    tf.gather(box_classes.flatten(), indices),
  ]
}

const yolo_boxes_to_corners = (
  box_xy: tf.Tensor<tf.Rank>,
  box_wh: tf.Tensor<tf.Rank>
  ) => {
  const two = tf.tensor1d([2.0])
  const box_mins = tf.sub(box_xy, tf.div(box_wh, two))
  const box_maxes = tf.add(box_xy, tf.div(box_wh, two))

  const dim_0 = box_mins.shape[0] as number
  const dim_1 = box_mins.shape[1] as number
  const dim_2 = box_mins.shape[2] as number
  const size = [dim_0, dim_1, dim_2, 1]

  return tf.concat([
    box_mins.slice([0, 0, 0, 1], size),
    box_mins.slice([0, 0, 0, 0], size),
    box_maxes.slice([0, 0, 0, 1], size),
    box_maxes.slice([0, 0, 0, 0], size),
  ], 3)
}

const yolo_head = (
  feats: tf.Tensor<tf.Rank>,
  anchors: tf.Tensor<tf.Rank.R2>,
  num_classes: number
  ) => {
  const num_anchors = anchors.shape[0]

  const anchors_tensor = tf.reshape(anchors, [1, 1, num_anchors, 2])

  let conv_dims = feats.shape.slice(1, 3)

  const conv_dims_0 = conv_dims[0]
  const conv_dims_1 = conv_dims[1]

  let conv_height_index = tf.range(0, conv_dims[0])
  let conv_width_index = tf.range(0, conv_dims[1])
  conv_height_index = tf.tile(conv_height_index, [conv_dims[1]])

  conv_width_index = tf.tile(tf.expandDims(conv_width_index, 0), [conv_dims[0], 1])
  conv_width_index = tf.transpose(conv_width_index).flatten()

  let conv_index = tf.transpose(tf.stack([conv_height_index, conv_width_index]))
  conv_index = tf.reshape(conv_index, [conv_dims[0], conv_dims[1], 1, 2])
  conv_index = tf.cast(conv_index, feats.dtype)

  feats = tf.reshape(feats, [conv_dims[0], conv_dims[1], num_anchors, num_classes + 5])
  let conv_dims_t = tf.cast(tf.reshape(tf.tensor1d(conv_dims), [1,1,1,2]), feats.dtype)

  let box_xy = tf.sigmoid(feats.slice([0,0,0,0], [conv_dims_0, conv_dims_1, num_anchors, 2]))
  let box_wh = tf.exp(feats.slice([0,0,0, 2], [conv_dims_0, conv_dims_1, num_anchors, 2]))
  const box_confidence = tf.sigmoid(feats.slice([0,0,0, 4], [conv_dims_0, conv_dims_1, num_anchors, 1]))
  const box_class_probs = tf.softmax(feats.slice([0,0,0, 5],[conv_dims_0, conv_dims_1, num_anchors, num_classes]))

  box_xy = tf.div(tf.add(box_xy, conv_index), conv_dims_t)
  box_wh = tf.div(tf.mul(box_wh, anchors_tensor), conv_dims_t)

  return [ box_xy, box_wh, box_confidence, box_class_probs ]
}

async function yolo(
  input: tf.Tensor,
  model: tf.Model,
  {
    classProbThreshold = DEFAULT_CLASS_PROB_THRESHOLD,
    iouThreshold = DEFAULT_IOU_THRESHOLD,
    filterBoxesThreshold = DEFAULT_FILTER_BOXES_THRESHOLD,
    yoloAnchors = YOLO_ANCHORS,
    maxBoxes = DEFAULT_MAX_BOXES,
    width: widthPx = DEFAULT_INPUT_DIM,
    height: heightPx = DEFAULT_INPUT_DIM,
    numClasses = 80,
    classNames = class_names,
  } = {},
) {
  const outs = tf.tidy(() => {
    const activation = model.predict(input) as tf.Tensor<tf.Rank>

    const [box_xy, box_wh, box_confidence, box_class_probs ] =
      yolo_head(activation, yoloAnchors, numClasses)

    const all_boxes = yolo_boxes_to_corners(box_xy, box_wh)

    let [boxes, scores, classes] = yolo_filter_boxes(
      all_boxes, box_confidence, box_class_probs, filterBoxesThreshold)

    const width = tf.scalar(widthPx)
    const height = tf.scalar(heightPx)

    const image_dims = tf.stack([height, width, height, width]).reshape([1,4])

    boxes = tf.mul(boxes, image_dims)

    return [boxes, scores, classes]
  })

  if (outs === null) {
    return []
  }

  const [boxes, scores, classes] = outs

  const indices = await tf.image.nonMaxSuppressionAsync(boxes as tf.Tensor<tf.Rank.R2>, scores as tf.Tensor<tf.Rank.R1>, maxBoxes, iouThreshold)

  const classes_indx_arr = await classes.gather(indices).data() as Float32Array
  const keep_scores = await scores.gather(indices).data() as Float32Array
  const boxes_arr = await boxes.gather(indices).data() as Float32Array

  tf.dispose(outs)
  indices.dispose()

  const results = [] as Object[]

  classes_indx_arr.forEach((value: number, index: number) => {
    const classProb = keep_scores[index]
    if (classProb < classProbThreshold) {
      return
    }

    const className = classNames[value]
    let [top, left, bottom, right] = [
      boxes_arr[4 * index],
      boxes_arr[4 * index + 1],
      boxes_arr[4 * index + 2],
      boxes_arr[4 * index + 3],
    ]

    top = Math.max(0, top)
    left = Math.max(0, left)
    bottom = Math.min(heightPx, bottom)
    right = Math.min(widthPx, right)

    const resultObj = {
      className,
      classProb,
      bottom,
      top,
      left,
      right,
    }

    results.push(resultObj)
  })

  return results
}

const objDet = async (image: ImageData) => {
  const model = await downloadModel()
  let inputTensor = tf.fromPixels(image).expandDims(0)
  return await yolo(inputTensor, model)
}

export { objDet } 
