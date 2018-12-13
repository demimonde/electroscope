import { ExiftoolProcess } from 'node-exiftool'
import exiftool from 'dist-exiftool'
import { Readable } from 'stream'
import { jqt } from 'rqt'
import { stringify } from 'querystring'

const getLocation = async (lat, long) => {
  const s = stringify({
    'subscription-key': process.env.AZURE_MAPS_KEY,
    'api-version': '1.0',
    query: `${lat},${long}`,
  })
  const res = await jqt('https://atlas.microsoft.com/search/address/reverse/json?'
    + s)
  return res
}

function decodeBase64Image(context, data) {
  const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

  if (matches.length !== 3) {
    context.log('Error case')
    return
  }

  const [, type, b] = matches
  return {
    type,
    data: Buffer.from(b, 'base64'),
  }
}

export default async function (context, req) {
  const apiKey = context.bindingData.apiKey
  context.log(apiKey)
  const image = decodeBase64Image(context, req.body)
  const ep = new ExiftoolProcess(exiftool)
  await ep.open()
  const rs = new Readable({
    read() {
      this.push(image.data)
      this.push(null)
    },
  })
  const { data, error } = await ep.readMetadata(rs, ['n'])
  if (error) {
    throw error
  }
  await ep.close()
  const [body] = data
  if (body.GPSLatitude && body.GPSLongitude) {
    const loc = await getLocation(body.GPSLatitude, body.GPSLongitude)
    context.log(loc)
    body.Location = loc
  }
  context.res = {
    body,
    headers: {
      'content-type': 'application/json',
    },
  }
}