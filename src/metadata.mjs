import {
  writeFileSync as wf,
  readFileSync as rf
} from 'fs'
import { resolve } from 'path'
import pug from 'pug'
import { getDynamic } from './shorthands.mjs'
import { fileURLToPath as fileUrl } from 'url'
const dirname = fileUrl(new URL('.', import.meta.url))

const getPosts = src => {
  return getDynamic(resolve(src, 'content', 'posts'))
    .sort((a, b) => {
      if (a.meta.date > b.meta.date) return -1
      if (a.meta.date < b.meta.date) return 1
      return 0
    })
}

const buildRSS = (src, publicDir) => {
  console.log('- Building RSS file'.magenta)
  const posts = getPosts(src).slice(0, 10)
  const lastUpdated = posts[0]?.meta.date

  const xml = pug.renderFile(resolve(dirname, 'rss.pug'), {
    pretty: true,
    posts,
    ...global.definitions,
    lastUpdated
  })
  wf(resolve(publicDir, 'atom.xml'), xml)
  const xsl = rf(resolve(dirname, 'rss.xsl'))
    .replace('/styles.css', `${global.definitions.siteUrl}/styles.css`)
  wf(resolve(publicDir, 'rss.xsl'), xsl)
}

const buildSitemap = (src, publicDir) => {
  console.log('- Building Sitemap'.magenta)
  const posts = getPosts(src)
  const lastUpdated = posts[0]?.meta.date
  const xml = pug.renderFile(resolve(dirname, 'sitemap.pug'), {
    pretty: true,
    posts,
    ...global.definitions,
    lastUpdated
  })
  wf(resolve(publicDir, 'sitemap.xml'), xml)
  const xsl = rf(resolve(dirname, 'sitemap.xsl'))
    .replace('/styles.css', `${global.definitions.siteUrl}/styles.css`)
  wf(resolve(publicDir, 'sitemap.xsl'), xsl)
}

export const execute = (src, publicDir) => {
  buildRSS(src, publicDir)
  buildSitemap(src, publicDir)
}
