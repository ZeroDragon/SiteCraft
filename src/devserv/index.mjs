import { watch as watcher } from 'fs'
import { extname, resolve } from 'path'
import { EventEmitter } from 'events'
import { debouncer } from './debouncer.mjs'
import { server } from './server.mjs'
import { eventServer } from './eventServer.mjs'

global.evt = new EventEmitter()

export const watch = buildList => {
  watcher(process.cwd(), { recursive: true }, (_eventType, filename) => {
    const fileExt = extname(filename)
    const now = new Date().getSeconds()
    if (fileExt.includes('~')) return
    if (!debouncer.ex(filename)) return

    const isinBuild = buildList.some(item => {
      return resolve(process.cwd(), `${filename}`).includes(item)
    })

    const isInDist = resolve(process.cwd(), `${filename}`).includes('public/')

    if (isinBuild) global.evt.emit('sourceChange', filename)
    if (isInDist && debouncer.ex(now)) global.evt.emit('distChange', filename)
  })
}

export const start = async port => {
  const eventPort = await eventServer()
  server(eventPort, port)
}
