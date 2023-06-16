import { readFileSync as rf } from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

export const execute = (src) => {
  global.definitions = yaml.load(rf(resolve(src, 'site.yml')))
  const { ENV } = process.env
  if (ENV === 'production') return
  global.definitions.siteUrl = ''
}
