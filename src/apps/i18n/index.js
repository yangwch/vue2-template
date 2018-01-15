import {getStore} from '@/config/mUtils'
import cn from './cn'
import en from './en'
import numberFormats from "./numberFormates";
import {locale} from '@/config/env'

const messages = { }
Object.assign(messages, {cn: cn, en: en})

// Create VueI18n instance with options
export default {locale: getStore('locale') || locale, messages, numberFormats}
