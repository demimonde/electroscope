import write from '@wrote/write'
import { v4 } from 'uuid'
import { ExiftoolProcess } from 'node-exiftool'
import exiftool from 'dist-exiftool'

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
  context.log('JavaScript HTTP trigger function processed a request.')

  const response = decodeBase64Image(context, req.body.data)
  context.log('filename: ' + req.name)
  context.log('filetype: ' + response.type)
  const v = v4()
  await write(v)
  const ep = new ExiftoolProcess(exiftool)
  await ep.open()
  const [data] = await ep.readMetadata(v, ['n'])
  context.res = {
    body: data,
  }

  // if (req.query.name || (req.body && req.body.name)) {
  //   context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     body: `Hello ${req.query.name || req.body.name}`,
  //   }
  // } else {
  //   context.res = {
  //     status: 400,
  //     body: 'Please pass a name on the query string or in the request body.',
  //   }
}