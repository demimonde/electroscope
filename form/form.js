import { resolve } from 'path'
import { readBuffer } from '@wrote/read'
import mime from 'mime-types'

/**
 * The route is used to serve the key acquired during the greenlock debug session.
 */
export default async function (context) {
  try {
    let body
    const type = mime.lookup(context.bindingData.file)
    body = await readBuffer(resolve(__dirname, 'files', context.bindingData.file))
    const { NODE_ENV = 'dev' } = process.env
    if (['application/javascript', 'text/html'].includes(type)) {
      const bb = replaceBody(`${body}`, NODE_ENV)
      body = replaceEnv(bb)
    }

    context.res = {
      body,
      headers: {
        'content-type': type,
      },
    }
  } catch (err) {
    context.res = {
      status: 404,
      body: '404',
    }
  }
}

export const replaceEnv = (body) => {
  const r = body.replace(/<!-- ENV (.+?) -->/g, (m, env) => {
    const p = process.env[env]
    if (p) return p
    return m
  })
  return r
}

export const replaceBody = (body, env) => body.replace(/<!-- start (\w+) -->\n?([\s\S]+?)\n?<!-- end \1 -->/g,(match, e, code) => {
  if (e == env) return code
  return ''
})