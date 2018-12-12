import { ExiftoolProcess } from 'node-exiftool'
import exiftool from 'dist-exiftool'
import { Readable } from 'stream'

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
  context.res = {
    body: data[0],
    headers: {
      'content-type': 'application/json',
    },
  }
}