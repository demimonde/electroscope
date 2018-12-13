/* eslint-env browser */
/* global goog */
/* global exif2css */
// <!-- start production -->
goog.require('goog.dom')
goog.require('goog.dom.TagName')
goog.require('goog.net.XhrIo')
goog.require('goog.format.JsonPrettyPrinter')
goog.require('goog.html.SafeHtml')
goog.require('goog.events.FileDropHandler')
goog.require('goog.ui.AnimatedZippy')
// <!-- end production -->

function sayHi(data) {
  const div = goog.dom.createDom(goog.dom.TagName.DIV, {
    style: 'background-color:#EEE',
  }, data)
  goog.dom.appendChild(document.body, div)
}

const IGNORE = ['SourceFile', 'Directory', 'FileName', 'FileModifyDate', 'FileAccessDate', 'FileInodeChangeDate', 'FilePermissions']

const fileInput = document.getElementById('file')
const btn = document.querySelector('#btn')

const dropZone = goog.dom.getElement('drop-zone')
const handler = new goog.events.FileDropHandler(dropZone, true)
goog.events.listen(handler, goog.events.FileDropHandler.EventType.DROP, (e) => {
  const { files } = e.getBrowserEvent().dataTransfer
  debugger
})
const dragEnter = (e) => {
  addClass(e.target, 'DragActive')
}
const dragLeave = (e) => {
  removeClass(e.target, 'DragActive')
}
const drop = (e) => {
  removeClass(e.target, 'DragActive')
}
const removeClass = (el, className) => {
  const current = el.className.split(' ').map(a => a.trim())
  const newClasses = current.filter(a => a != className)
  el.className = newClasses.join(' ')
}
const addClass = (el, className) => {
  const current = el.className.split(' ').map(a => a.trim())
  el.className = [...current, className].join(' ')
}
goog.events.listen(dropZone, 'dragenter', dragEnter)
goog.events.listen(dropZone, 'dragleave', dragLeave)
goog.events.listen(dropZone, 'drop', drop)

btn.onclick = async () => {
  const [file] = fileInput.files
  if (!file) return
  upload(file)
}

async function upload(file) {
  const reader = new FileReader()
  reader.addEventListener('load', async function () {
    const base64encoded = reader.result
    const res = await executeUpload(base64encoded)
    const dem = new goog.format.JsonPrettyPrinter.SafeHtmlDelimiters()
    dem.lineBreak = goog.html.SafeHtml.BR
    dem.space = '&nbsp;'
    const f = new goog.format.JsonPrettyPrinter(dem)
    IGNORE.forEach(p => {
      delete res[p]
    })
    let mapHolder
    let add
    if (res.GPSLatitude && res.GPSLongitude) {
      const map = goog.dom.createDom(goog.dom.TagName.IMG, {
        src: `https://atlas.microsoft.com/map/static/png?subscription-key=<!-- ENV AZURE_MAPS_KEY -->&api-version=1.0&center=${res.GPSLongitude},${res.GPSLatitude}&width=250&height=250`,
      })
      mapHolder = goog.dom.createDom(goog.dom.TagName.DIV, {
        style: 'position: relative; display: inline-block; width: 250px; height: 250px;',
      })
      mapHolder.appendChild(map)
      mapHolder.appendChild(goog.dom.createDom(goog.dom.TagName.DIV, {
        style: 'position: absolute; top: 123px; left: 123px; background:red; border-radius: 3px; width: 6px; height: 6px;',
      }))
    }
    if (res.Location && res.Location.addresses.length) {
      const [{ address }] = res.Location.addresses
      const { streetName, municipalitySubdivision, municipality } = address
      add = goog.dom.createDom(goog.dom.TagName.EM, {
        style: 'display: block',
      }, [streetName, municipalitySubdivision || municipality].filter(a => a).join(', '))
    }
    const { transform = '', 'transform-origin': transformOrigin  } = exif2css(res.Orientation)
    const html = f.format(res)
    const s = [
      'vertical-align: top',
      'max-height: 250px',
      ...(res.Orientation > 4 ? ['max-width: 250px'] : []),
      ...(transform ? [`transform: ${transform}`] : []),
      ...(transformOrigin ? [`transform-origin: ${transformOrigin}`] : []),
    ].join(';')
    const img = goog.dom.createDom(goog.dom.TagName.IMG, {
      src: base64encoded,
      style: s,
    })
    const result = goog.dom.createDom(goog.dom.TagName.DIV, {
      class: 'Result',
      style: 'display: inline-block;font-family:monospace;',
    })
    result.innerHTML = html
    const header = goog.dom.createDom(goog.dom.TagName.H2)
    header.innerHTML = '<img src="images/blank.gif"> Metadata'
    const metadata = goog.dom.createDom(goog.dom.TagName.DIV, {
      class: 'Metadata',
    })
    metadata.appendChild(header)
    metadata.appendChild(result)
    const id = document.getElementById('info')
    id.innerHTML = ''
    id.appendChild(img)
    if (mapHolder) id.appendChild(mapHolder)
    if (add) id.appendChild(add)
    id.appendChild(metadata)
    const z1 = new goog.ui.AnimatedZippy(header, result, true)
  }, false)
  reader.readAsDataURL(file)
}

async function executeUpload(base64encoded) {
  const res = await new Promise((r) => {
    const xhr = goog.net.XhrIo.send('/api/upload/test-api', () => {
      var obj = xhr.getResponseJson()
      r(obj)
    }, 'POST', base64encoded)
    goog.events.listen(xhr.xhr_, 'progress', ({ event_ }) => {
      console.log('Uploaded ' + event_.loaded + '/' + event_.total)
    })
  })
  return res
}