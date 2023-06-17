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

const migrateContentImgs = (contentDir, publicDir) => {
  if (!ex(resolve(contentDir, 'images'))) return
  console.log('- Migrating content images'.magenta)
  const images = rd(resolve(contentDir, 'images'))
  images.forEach(image => {
    cf(resolve(contentDir, 'images', image), resolve(publicDir, 'content/images', image))
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

export const execute = (contentDir, publicDir, templateDir, section = 'all') => {
  new Array(...['images', 'content', 'content/images']).forEach(dir => {
    if (!ex(resolve(publicDir, dir))) mk(resolve(publicDir, dir))
  })
  switch (section) {
    case 'template/images':
      migrateImages(templateDir, publicDir)
      break
    case 'template/favicon':
      migrateFavicons(templateDir, publicDir)
      break
    case 'content/images':
      migrateContentImgs(contentDir, publicDir)
      break
    default:
      migrateImages(templateDir, publicDir)
      migrateFavicons(templateDir, publicDir)
      migrateContentImgs(contentDir, publicDir)
      break
  }
}
