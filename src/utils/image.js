const openimage = function (file) {
  let reader = new FileReader()
  if (file) {
    reader.readAsDataURL(file)
  }
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result)
    }
  })
}

export { openimage }
