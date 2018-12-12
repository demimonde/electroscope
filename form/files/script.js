/* eslint-env browser */
goog.require('goog.dom')
goog.require('goog.dom.TagName')

function sayHi() {
  const newdiv = goog.dom.createDom(goog.dom.TagName.H1, {
    style: 'background-color:#EEE',
  }, 'Hello world!')
  goog.dom.appendChild(document.body, newdiv)
}

window.sayHi = sayHi

const fileInput = document.getElementById('file')
const btn = document.querySelector('#btn')
btn.onclick = function () {
  console.log(fileInput.files)
  if (!fileInput.files.length) return
  const file = fileInput.files[0]
  const reader = new FileReader()
  reader.addEventListener('load', function () {
    const base64encoded = reader.result
    executeUpload(base64encoded, file.name)
    console.log('ok')
  }, false)
  reader.readAsDataURL(file)
}

function executeUpload(base64encoded, filename) {
  const headers = new Headers()
  const data = { filename: filename, data: base64encoded }
}