import {
  writeFileSync as wf,
  readFileSync as rf
} from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

export const execute = (src, publicDir) => {
  const definitions = yaml.load(rf(resolve(src, 'site.yml')))
  const { cname } = definitions

  console.log('- Creating CNAME file'.magenta)
  wf(resolve(publicDir, 'CNAME'), cname)
}
