#! /usr/bin/env node

import 'consolecolors'
import {
  rmSync as rm,
  mkdirSync as mk
} from 'fs'
import { resolve, extname } from 'path'
import { watch, start } from './devserv/index.mjs'

import { execute as imageExec } from './images.mjs'
import { execute as stylExec } from './styles.mjs'
import { execute as dynamicExec } from './dynamic.mjs'
import { execute as cnameExec } from './cname.mjs'
import { execute as defExec } from './definitions.mjs'
import { newEntry } from './entries.mjs'

const src = process.cwd()
const publicDir = resolve(src, 'public')
const templateDir = resolve(src, 'template')
const contentDir = resolve(src, 'content')
defExec(src)

export const buildAll = async _ => {
  rm(publicDir, { recursive: true, force: true })
  mk(resolve(publicDir))
  imageExec(contentDir, publicDir, templateDir)
  await stylExec(publicDir, templateDir)
  dynamicExec(src, publicDir, templateDir)
  cnameExec(publicDir)
}

const [, , action = false, path2entry] = process.argv

export const devServer = async () => {
  await buildAll()
  watch(
    [
      contentDir,
      templateDir,
      resolve(src, 'site.yml')
    ]
  )

  const dispatchImages = section => {
    console.log('- Change in images'.green)
    imageExec(contentDir, publicDir, templateDir, section)
  }

  global.evt
    .on('sourceChange', filename => {
      const fileExt = extname(filename)
      switch (fileExt) {
        case '.styl':
          console.log('- Change in styles detected'.green)
          stylExec(publicDir, templateDir)
          break
        case '.yml':
          console.log('- Change in site configuration'.green)
          buildAll()
          break
        case '.md':
        case '.pug':
          console.log('- Change in Blog files'.green)
          dynamicExec(src, publicDir, templateDir)
          break
        default:
          new Array(...['template/images', 'template/favicon', 'content/images']).forEach(section => {
            if (filename.includes(section)) dispatchImages(section)
          })
          break
      }
    })

  await start(8080)
}

export default {
  build: buildAll,
  serve: devServer
}

switch (action) {
  case 'build':
    await buildAll()
    break
  case 'serve':
    devServer()
    break
  case 'create':
    newEntry(contentDir, path2entry)
    break
  default:
    [
      '',
      'SiteCraft Help'.magenta,
      '',
      'Usage:',
      '$ sitecraft build '.blue + '# to build your site at public/'.grey,
      '$ sitecraft serve '.blue + '# to serve your site for development'.grey,
      '$ sitecraft create my-page.md '.blue + '# to add a page at content/my-page.md'.grey,
      '$ sitecraft create posts/my-post.md '.blue + '# to add a post at content/posts/my-page.md'.grey
    ].forEach(i => console.log(i))
    break
}
