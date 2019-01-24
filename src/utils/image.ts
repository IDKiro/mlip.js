const openimage = function (file: File) {
  let reader = new FileReader()
  if (file) {
    reader.readAsDataURL(file)
  }
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result)
      } else {
        reject(new Error('file read error'))
      }
    }
  })
}

export { openimage }
