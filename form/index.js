const { resolve } = require('path');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;

/**
 * The route is used to serve the key acquired during the greenlock debug session.
 */
module.exports=async function (context) {
  const body = await read(resolve(__dirname, 'index.html'))
  context.res = {
    body,
  }
}