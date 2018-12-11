import { resolve } from 'path'
import read from '@wrote/read'

/**
 * The route is used to serve the key acquired during the greenlock debug session.
 */
export default async function (context) {
  const body = await read(resolve(__dirname, 'key.txt'))
  context.res = {
    body,
  }
}