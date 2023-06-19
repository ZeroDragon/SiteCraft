import { createServer } from 'http'

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath as fileUrl } from 'url'

const dirname = fileUrl(new URL('.', import.meta.url))

export const server = (eventPort, port) => {
  const server = createServer()

  server.on('request', (req, res) => {
    const [url] = req.url.split('?')
    if (url === '/favicon.ico') return res.end()
    if (url === undefined) return res.end()

    const distDir = resolve(process.cwd(), 'public/')

    if (url.slice(-1) === '/') {
      const indexFile = readFileSync(resolve(distDir, `.${url}`, 'index.html'), 'utf8')
      const injected = readFileSync(resolve(dirname, './injected.html'), 'utf8')
        .replace('EVENT_PORT', eventPort)
      res.write(indexFile.replace('</body>', '\n' + injected + '</body>'))
    } else {
      const file = readFileSync(resolve(distDir, `.${url}`))
      res.write(file)
    }

    res.end()
  })

  server.listen(port, () => {
    console.log('')
    console.log('SiteCraft online at'.yellow, `http://localhost:${port}`.green.underline)
  })
}
