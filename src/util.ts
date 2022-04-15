import fs from 'fs-extra'
import path from 'path'

const isObject = (val: any) => val && typeof val === 'object'
const mergeArrayWithDedupe = (a: any[], b: any[]) => Array.from(new Set([...a, ...b]))

export function deepMerge(target: Record<string, any>, obj: Record<string, any>) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal)
    } else {
      target[key] = newVal
    }
  }

  return target
}

export function isDirEmpty(dir: string, mkdir: boolean = false) {
  fs.ensureDirSync(dir)
  return fs.readdirSync(dir).length === 0
}

export function readSubDirs(dir: string) {
  return fs.readdirSync(dir).filter(file => fs.statSync(path.resolve(dir, file)).isDirectory())
}
