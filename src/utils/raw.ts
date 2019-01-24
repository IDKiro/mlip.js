const openraw = function (file: File) {
  const dcraw = require('dcraw')
  let reader = new FileReader()
  if (file) {
    reader.readAsArrayBuffer(file)
  }
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      if (reader.result) {
        let buf = new Uint8Array(reader.result as ArrayBuffer)
        let thumbnail = dcraw(buf, { extractThumbnail: true })
        let blob = new Blob([thumbnail], { type: "image/jpeg" })
        let urlCreator = window.URL
        let thumbUrl = urlCreator.createObjectURL(blob)
        resolve(thumbUrl)
      } else {
        reject(new Error('file read error'))
      }
    }
  })
}

export { openraw }
