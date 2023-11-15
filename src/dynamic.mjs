import {
  writeFileSync as wf,
  mkdirSync as mk,
  existsSync as ex,
  rmSync as rm
} from 'fs'
import { resolve } from 'path'
import pug from 'pug'
import { execute as shortHands, getDynamic } from './shorthands.mjs'

export const execute = (src, publicDir, templateDir) => {
  console.log('- Loading dynamic data'.magenta)
  rm(resolve(publicDir, 'posts'), { recursive: true, force: true })
  const definitions = global.definitions
  const siteParams = JSON.parse(JSON.stringify(definitions))

  const pages = getDynamic(resolve(src, 'content'))
  const posts = getDynamic(resolve(src, 'content', 'posts'))
    .sort((a, b) => {
      if (a.meta.date > b.meta.date) return -1
      if (a.meta.date < b.meta.date) return 1
      return 0
    })
  if (posts.length > 0 && !ex(resolve(publicDir, 'posts'))) {
    mk(resolve(publicDir, 'posts'))
  }

  pages
    .map(({ html, path }) => ({ html: shortHands(src, templateDir, html), path }))
    .forEach(({ html, path }) => {
      const template = pug.renderFile(resolve(templateDir, 'page.pug'), {
        pretty: true,
        ...Object.assign(siteParams, { pageData: html })
      })
      if (path === 'homepage') return wf(resolve(publicDir, 'index.html'), template)
      if (!ex(resolve(publicDir, path))) mk(resolve(publicDir, path))
      wf(resolve(publicDir, `${path}/index.html`), template)
    })

  posts
    .map((item, index) => {
      const prev = posts[index - 1] || {}
      const next = posts[index + 1] || {}
      return {
        ...item,
        prev: { ...prev.meta, path: prev.path },
        next: { ...next.meta, path: next.path }
      }
    })
    .forEach(({ html, path, meta, prev, next }) => {
      const _template = pug.renderFile(resolve(templateDir, 'post.pug'), {
        pretty: true,
        ...Object.assign(siteParams, {
          pageData: html,
          comments: meta.comments || {},
          siteName: `${meta.title} - ${siteParams.siteName}`
        }),
        prev,
        next,
        ...meta
      })
      const template = shortHands(src, templateDir, _template)
      if (!ex(resolve(publicDir, 'posts', path))) mk(resolve(publicDir, 'posts', path))
      wf(resolve(publicDir, `posts/${path}/index.html`), template)
    })
}
