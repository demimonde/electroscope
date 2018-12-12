import { deepEqual } from 'zoroaster'
import upload from '../../../upload/upload'
import read from '@wrote/read'

const T = {
  async 'execs the form'() {
    const logged = []
    const context = {
      bindingData: {
        file: 'test.txt',
      },
      log(...args) {
        logged.push(args)
      },
    }
    const d = await read('test/fixture/px.gif')
    const b = Buffer.from(d).toString('base64')
    await upload(context, {
      body: {
        data: `data:image/png;base64,${b}`,
      },
    })
    const { ImageWidth, ImageHeight } = context.res.body
    deepEqual({ ImageWidth, ImageHeight }, {
      ImageWidth: 1,
      ImageHeight: 1,
    })
  },
}
export default T
