import {
  copyFileSync as cf,
  readdirSync as rd,
  mkdirSync as mk,
  existsSync as ex
} from 'fs'
import { resolve } from 'path'

const migrateImages = (templateDir, publicDir) => {
  if (!ex(resolve(templateDir, 'images'))) return
  console.log('- Migrating images'.magenta)
  const images = rd(resolve(templateDir, 'images'))
  images.forEach(image => {
    cf(resolve(templateDir, 'images', image), resolve(publicDir, 'images', image))
  })
}

const migrateFavicons = (templateDir, publicDir) => {
  if (!ex(resolve(templateDir, 'favicon'))) return
  console.log('- Migrating favicons'.magenta)
  const favicon = rd(resolve(templateDir, 'favicon'))
  favicon.forEach(item => {
    cf(resolve(templateDir, 'favicon', item), resolve(publicDir, item))
  })
}

export const execute = (publicDir, templateDir) => {
  mk(resolve(publicDir, 'images'))
  migrateImages(templateDir, publicDir)
  migrateFavicons(templateDir, publicDir)
}
