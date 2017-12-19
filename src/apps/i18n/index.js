import {getStore} from '@/config/mUtils'
import cn from './cn'
import en from './en'
import numberFormats from "./numberFormates";

const messages = { }
Object.assign(messages, {cn: cn, en: en})

// Create VueI18n instance with options
export default {locale: getStore('locale') || 'cn', messages, numberFormats}
