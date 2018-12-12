import { equal } from 'zoroaster'
import form from '../../../form/form'

const T = {
  async 'execs the form'() {
    const context = {
      bindingData: {
        file: 'test.txt',
      },
    }
    await form(context)
    equal(context.res.body, 'test')
  },
  async 'replaces using the env'() {
    const context = {
      bindingData: {
        file: 'test-replace.html',
      },
    }
    await form(context)
    equal(context.res.body, `<script src='dev'></script>
<script src='script.js'></script>
`)
  },
}
export default T
