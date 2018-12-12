import { resolve } from 'path'
import read from '@wrote/read'
import mime from 'mime-types'

/**
 * The route is used to serve the key acquired during the greenlock debug session.
 */
export default async function (context) {
  try {
    const b = await read(resolve(__dirname, 'files', context.bindingData.file))
    const { NODE_ENV = 'dev' } = process.env
    const body = replaceBody(b, NODE_ENV)

    context.res = {
      body,
      headers: {
        'content-type': mime.lookup(context.bindingData.file),
      },
    }
  } catch (err) {
    context.res = {
      status: 404,
      body: '404',
    }
  }
}

export const replaceBody = (body, env) => body.replace(/<!-- start (\w+) -->\n?([\s\S]+?)\n?<!-- end \1 -->/g,(match, e, code) => {
  if (e == env) return code
  return ''
})