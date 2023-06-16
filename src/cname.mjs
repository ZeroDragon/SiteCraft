import { writeFileSync as wf } from 'fs'
import { resolve } from 'path'

export const execute = (publicDir) => {
  const { cname } = global.definitions
  if (cname === undefined) return
  console.log('- Creating CNAME file'.magenta)
  wf(resolve(publicDir, 'CNAME'), cname)
}
