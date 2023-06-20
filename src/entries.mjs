import { readFileSync as rf, writeFileSync as wf } from 'fs'
import { fileURLToPath as fileUrl } from 'url'
import { resolve } from 'path'
const dirname = fileUrl(new URL('.', import.meta.url))

const template = rf(resolve(dirname, 'template.md'), 'utf8')
const addZ = i => `${i}`.padStart(2, 0)

export const newEntry = (base, path2entry) => {
  const now = new Date()
  const dateInt = parseInt([
    now.getFullYear(),
    addZ(now.getMonth() + 1),
    addZ(now.getDate()),
    addZ(now.getHours()),
    addZ(now.getMinutes())
  ].join(''), 10)
  wf(resolve(base, path2entry), template.replace('############', dateInt))
}
