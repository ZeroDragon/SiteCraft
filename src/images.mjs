import {
  copyFileSync as cf,
  readdirSync as rd,
  mkdirSync as mk
} from 'fs'
import { resolve } from 'path'

export const execute = (publicDir, templateDir) => {
  mk(resolve(publicDir, 'images'))

  console.log('- Migrating images'.magenta)
  const images = rd(resolve(templateDir, 'images'))
  images.forEach(image => {
    cf(resolve(templateDir, 'images', image), resolve(publicDir, 'images', image))
  })
  const favicon = rd(resolve(templateDir, 'favicon'))
  favicon.forEach(item => {
    cf(resolve(templateDir, 'favicon', item), resolve(publicDir, item))
  })
}
