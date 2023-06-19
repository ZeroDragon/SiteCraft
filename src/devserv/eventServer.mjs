import { createServer } from 'http'

export const eventServer = async _ => {
  const eventServer = createServer()

  eventServer.on('request', (_req, res) => {
    if (res.url === '/favicon.ico') return res.end()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    res.setHeader('Access-Control-Max-Age', 2592000)
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.write('\n')

    global.evt.on('distChange', fileExt => {
      res.write(`data: ${fileExt}\n\n`)
    })
  })

  const p = new Promise(resolve => {
    eventServer.listen(0, () => {
      resolve(eventServer.address().port)
    })
  })

  return p
}
