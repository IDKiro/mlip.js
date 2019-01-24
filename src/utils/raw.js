const openraw = function (file) {
  const dcraw = require('dcraw')
  let reader = new FileReader()
  if (file) {
    reader.readAsArrayBuffer(file)
  }
  return new Promise((resolve) => {
    reader.onload = () => {
      let buf = new Uint8Array(reader.result)
      let thumbnail = dcraw(buf, { extractThumbnail: true })
      let blob = new Blob([thumbnail], { type: "image/jpeg" })
      let urlCreator = window.URL || window.webkitURL
      let thumbUrl = urlCreator.createObjectURL(blob)
      resolve(thumbUrl)
    }
  })
}

export { openraw }
