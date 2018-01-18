import common from './common'
import demo from './demo'

let i18n = Object.assign({}, common)

if (process.env.NODE_ENV === 'development') {
  i18n = Object.assign({demo: demo}, i18n)
}

export default i18n
