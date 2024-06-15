import {
  existsSync as ex,
  readdirSync as rd,
  readFileSync as rf,
  statSync as ss
} from 'fs'
import { resolve, extname, basename, dirname } from 'path'
import pug from 'pug'
import { marked } from 'marked'
import yaml from 'js-yaml'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const renderer = new marked.Renderer()
renderer.link = function () {
  const link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace('<a', '<a target="_blank"')
}
marked.setOptions({ renderer })

const getDate = input => {
  if (!input?.meta) return {}
  const date = input.meta.date.toString()
  const year = date.slice(0, 4)
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  return {
    ...input.meta,
    date: new Date(year, month - 1, day)
  }
}

export const getDynamic = dir => {
  try {
    return rd(dir)
      .filter(item => extname(item) === '.md')
      .map(item => resolve(dir, item))
      .map(file => ({ markdown: rf(file, 'utf8'), file }))
      .map(({ markdown, file }) => {
        const [meta, ...mkd] = markdown.split('\n\n')
        const parsedMeta = getDate(yaml.load(meta))
        return { markdown: mkd.join('\n\n'), file, meta: parsedMeta }
      })
      .map(({ markdown, file, meta }) => ({
        html: marked.parse(markdown, { mangle: false, headerIds: false }),
        path: basename(file, '.md').replace(/\s/g, '-'),
        meta
      }))
  } catch (e) {
    return []
  }
}

export const execute = (src, templateDir, html) => {
  const blogList = resolve(templateDir, 'partials/blogList.pug')
  const definitions = global.definitions
  const siteParams = JSON.parse(JSON.stringify(definitions))

  const posts = getDynamic(resolve(src, 'content', 'posts'))
    .sort((a, b) => {
      if (a.meta.date > b.meta.date) return -1
      if (a.meta.date < b.meta.date) return 1
      return 0
    })

  let list = ''
  if (ex(blogList)) {
    list = pug.renderFile(blogList, {
      pretty: true,
      ...siteParams,
      posts
    })
  }

  const shortHands = {
    blogList: list,
    siteName: siteParams.siteName,
    siteUrl: siteParams.siteUrl,
    siteDesc: siteParams.siteDesc
  }

  const resolvedPlugins = []
  const resolvePluginScripts = (dir) => {
    return rd(dir)
      .map(item => resolve(dir, item))
      .forEach(file => {
        if (ss(file).isDirectory()) return resolvePluginScripts(file)
        if (extname(file) !== '.js') return
        if (ss(file).isFile()) return resolvedPlugins.push([dirname(file), require(file)])
      })
  }
  resolvePluginScripts(resolve(src, 'template', 'plugins'))
  resolvedPlugins.forEach(([filePath, plugin]) => {
    for (const key in plugin.shortHands) {
      const shortHand = plugin.shortHands[key]
      const html = pug.renderFile(resolve(filePath, shortHand.template), {
        pretty: true,
        ...siteParams,
        ...yaml.load(shortHand.data).meta,
        path: shortHand.file
      })
      shortHands[key] = html
    }
  })

  return Object.entries(shortHands).reduce((acumulator, [key, value]) => {
    return acumulator
      .replace(new RegExp(`!{${key}}`), value)
      .replace(new RegExp(`!%7B${key}%7D`), value)
  }, html)
}
