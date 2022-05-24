function getMapUrl(str) {
  const baseUrl = 'https://www.google.com/maps/search/?api=1&query='
  return baseUrl + stringToHex(str)
}

function stringToHex(str) {
  const re = /[\u4E00-\u9FA5]/
  const ar = []
  for (let i = 0; i < str.length; i++) {
    let a = ''
    if (re.test(str.charAt(i))) {
      // 中文
      a = encodeURI(str.charAt(i))
    } else if (str[i] === ' ') {
      a = '+'
    } else {
      a = str[i]
    }
    ar.push(a)
  }
  str = ar.join('')
  return str
}

module.exports = getMapUrl