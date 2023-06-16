#! /usr/bin/env node

import 'consolecolors'
import {
  rmSync as rm,
  mkdirSync as mk
} from 'fs'
import { resolve, extname } from 'path'
import chokidar from 'chokidar'
import liveServer from 'live-server'

import { execute as imageExec } from './images.mjs'
import { execute as stylExec } from './styles.mjs'
import { execute as dynamicExec } from './dynamic.mjs'
import { execute as cnameExec } from './cname.mjs'

const src = process.cwd()
const publicDir = resolve(src, 'public')
const templateDir = resolve(src, 'template')
const contentDir = resolve(src, 'content')

export const buildAll = async _ => {
  rm(publicDir, { recursive: true, force: true })
  mk(resolve(publicDir))
  imageExec(publicDir, templateDir)
  await stylExec(publicDir, templateDir)
  dynamicExec(src, publicDir, templateDir)
  cnameExec(src, publicDir)
}

const [, , action = false] = process.argv
const isServer = action === 'serve'
const isBuilder = action === 'build'

export const devServer = async () => {
  const watcher = chokidar.watch(
    [
      contentDir,
      templateDir,
      resolve(src, 'site.yml')
    ], {
      ignored: /(^|[\/\\])\../, // eslint-disable-line
      persistent: true
    }
  )

  watcher
    .on('ready', () => console.log('Dev watcher started'))
    .on('raw', (_event, path) => {
      const fileType = extname(path)
      switch (fileType) {
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
        case '':
          console.log(_event, path)
          break
        default:
          console.log('- Change in images'.green)
          imageExec(publicDir, templateDir)
      }
    })
    .on('error', error => console.error(error))

  liveServer.start({
    port: 8080,
    host: 'localhost',
    root: publicDir,
    file: 'index.html',
    logLevel: 2,
    open: true
  })
}

export default {
  build: buildAll,
  serve: devServer
}

if (isBuilder) await buildAll()
if (isServer) devServer()
