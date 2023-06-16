import {
  writeFileSync as wf,
  readFileSync as rf
} from 'fs'
import { resolve } from 'path'
import stylus from 'stylus'

export const execute = async (publicDir, templateDir) => {
  console.log('- Building styles file'.magenta)
  const definitions = global.definitions
  const partials = resolve(templateDir, 'partials/')
  const source = resolve(templateDir, 'styles.styl')
  const css = await new Promise((resolve, reject) => {
    const string = rf(source, 'utf8')
    stylus(string)
      .set('paths', [partials])
      .define('$siteUrl', definitions.siteUrl)
      .render((err, rendered) => {
        if (err) return reject(err)
        resolve(rendered)
      })
  })
  return wf(resolve(publicDir, 'styles.css'), css)
}
