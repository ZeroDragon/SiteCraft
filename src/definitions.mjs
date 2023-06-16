import { readFileSync as rf } from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

export const execute = (src) => {
  global.definitions = yaml.load(rf(resolve(src, 'site.yml')))
  const { ENV } = process.env
  global.definitions.pages = global.definitions.pages || {}
  if (ENV === 'production') {
    for (const [key, value] of Object.entries(global.definitions.pages)) {
      global.definitions.pages[key] = global.definitions.siteUrl + value
    }
    return
  }
  global.definitions.siteUrl = ''
}
