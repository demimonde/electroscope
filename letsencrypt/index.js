const { resolve } = require('path');
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;

module.exports=async function (context) {
  const body = await read(resolve(__dirname, 'key.txt'))
  context.res = {
    body,
  }
}