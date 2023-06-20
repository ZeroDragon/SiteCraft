import { createServer } from 'http'

import { readFileSync, existsSync } from 'fs'
import { resolve, extname } from 'path'
import { fileURLToPath as fileUrl } from 'url'

const dirname = fileUrl(new URL('.', import.meta.url))
const distDir = resolve(process.cwd(), 'public/')

const getFile = file => {
  if (existsSync(file)) return file
  return resolve(distDir, 'index.html')
}

export const server = (eventPort, port) => {
  const server = createServer()

  server.on('request', (req, res) => {
    const [url] = req.url.split('?')
    if (url === undefined) return res.end()

    if (extname(url) === '') {
      const file = getFile(resolve(distDir, `.${url}`, 'index.html'))
      const indexFile = readFileSync(file, 'utf8')
      const injected = readFileSync(resolve(dirname, './injected.html'), 'utf8')
        .replace('EVENT_PORT', eventPort)
      res.write(indexFile.replace('</body>', '\n' + injected + '</body>'))
    } else {
      const file = readFileSync(getFile(resolve(distDir, `.${url}`)))
      res.write(file)
    }

    res.end()
  })

  server.listen(port, () => {
    console.log('')
    console.log('SiteCraft online at'.yellow, `http://localhost:${port}`.green.underline)
  })
}
