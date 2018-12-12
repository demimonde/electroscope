/* eslint-env browser */
goog.require('goog.dom')
goog.require('goog.dom.TagName')
goog.require('goog.net.XhrIo')
goog.require('goog.format.JsonPrettyPrinter')
goog.require('goog.html.SafeHtml')

function sayHi(data) {
  const div = goog.dom.createDom(goog.dom.TagName.DIV, {
    style: 'background-color:#EEE',
  }, data)
  goog.dom.appendChild(document.body, div)
}

const fileInput = document.getElementById('file')
const btn = document.querySelector('#btn')
btn.onclick = function () {
  console.log(fileInput.files)
  if (!fileInput.files.length) return
  const file = fileInput.files[0]
  const reader = new FileReader()
  reader.addEventListener('load', async function () {
    const base64encoded = reader.result
    const res = await executeUpload(base64encoded)
    const dem = new goog.format.JsonPrettyPrinter.SafeHtmlDelimiters()
    dem.lineBreak = goog.html.SafeHtml.BR
    dem.space = '&nbsp;'
    const f = new goog.format.JsonPrettyPrinter(dem)
    const html = f.format(res)
    document.getElementById('info').innerHTML = html
  }, false)
  reader.readAsDataURL(file)
}

async function executeUpload(base64encoded) {
  const res = await new Promise((r) => {
    goog.net.XhrIo.send('/api/upload/test-api', function(e) {
      var xhr = e.target
      var obj = xhr.getResponseJson()
      r(obj)
    }, 'POST', base64encoded)
  })
  return res
}