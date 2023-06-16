import {
  writeFileSync as wf,
  readFileSync as rf
} from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

export const execute = (src, publicDir) => {
  const definitions = yaml.load(rf(resolve(src, 'site.yml')))
  const { cname } = definitions

  if (cname === undefined) return

  console.log('- Creating CNAME file'.magenta)
  wf(resolve(publicDir, 'CNAME'), cname)
}
