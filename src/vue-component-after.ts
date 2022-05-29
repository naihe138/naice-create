import { readFileSync, renameSync, writeFileSync } from "fs";
import { resolve } from "path";
import type { TAfterParams } from "./config";


function readWriteFileSync(path, callback) {
  writeFileSync(path, callback(readFileSync(path, { encoding: 'utf8' })), { encoding: 'utf8' })
}
const replace = (source: string, target: string, text: string) => {
  const reg = new RegExp(target, 'g')
  return source.replace(reg, text)
}

function vueComponentAfter (options: TAfterParams) {
  const { cwd, projectName } = options
  readWriteFileSync(resolve(cwd, './package.json'), (text: string) => replace(text, 'my-component', projectName))
  readWriteFileSync(resolve(cwd, './src/components/index.ts'), (text: string) => replace(text, 'my-component', projectName))
  renameSync(resolve(cwd, './src/components/my-component.vue'), resolve(cwd, `./src/components/${projectName}.vue`))
}

export default vueComponentAfter;