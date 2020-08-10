/**
 * 转换base64为blob对象
 * @param {String} urlData base64编码
 * @param {String} imageType 图片类型
 */
export const convertBase64UrlToBlob = (urlData, imageType) => {
  const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: imageType || 'image/jpeg' })
}
/**
 * 图片压缩，宽度大于 maxWidth 会被压缩
 * @param {File} file 文件
 * @param {Number} maxWidth 最大宽度
 */
export const compress = (file, maxWidth = 750) => {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image()
      const isImageUrl = typeof file === 'string'
      const imageType = isImageUrl
        ? `image/${file.slice(file.lastIndexOf('.') + 1) || 'jpeg'}`
        : file.type || 'image/jpeg'
      image.src = isImageUrl ? String(file) : URL.createObjectURL(file)
      image.setAttribute('crossOrigin', 'Anonymous')
      image.onload = function() {
        // 默认按比例压缩
        let w = image.width
        let h = image.height
        let quality = 0.7 // 默认图片质量为0.7
        if (maxWidth && image.width > maxWidth) {
          w = maxWidth
          h = (maxWidth * h) / image.width
        } else {
          if (file.size / 1024 > 100) {
            quality = 0.8
          } else {
            resolve(file)
            return
          }
        } // 生成canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d') // 创建属性节点
        const anw = document.createAttribute('width')
        anw.nodeValue = `${w}`
        const anh = document.createAttribute('height')
        anh.nodeValue = `${h}`
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(image, 0, 0, w, h)
        const fileObj = !isImageUrl ? file : {} // 图像质量
        if (
          !isImageUrl &&
          fileObj.quality &&
          fileObj.quality <= 1 &&
          fileObj.quality > 0
        ) {
          quality = fileObj.quality
        }
        const data = canvas.toDataURL(imageType, quality) // 压缩完成执行回调
        const newFile = convertBase64UrlToBlob(data, imageType)
        resolve(newFile)
      }
      image.onerror = function(e) {
        reject(e)
      }
    } catch (error) {
      reject(error)
    }
  })
}
/**
 * 获取相对路径
 * @param { Array| String } urls 图片路径
 * @param {String} domainPath 域名
 */
export const getRelativeImgPath = (urls, domainPath) => {
  if (typeof urls === 'string') {
    return urls.replace(domainPath, '')
  }
  if (Array.isArray(urls)) {
    return urls.map(s => s.replace(domainPath, ''))
  }
  return ''
}
