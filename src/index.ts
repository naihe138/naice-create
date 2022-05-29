import minimist from 'minimist'
import { red, green } from 'kolorist'
import { prompt, type Answers, type QuestionCollection } from 'inquirer'
import path from 'path'
import { spawnSync } from 'child_process'
import { templateConfig } from './config'
import { isDirEmpty } from  './util'
const types = ['h5', 'react', 'express', 'lib'] as const

type TemplateType = typeof types[number]

export type CreateConfig = {
  prompts?: QuestionCollection<Answers>
  include?: string[]
  after?: (options: {
    cwd: string
    type: string
    template: string
    dest: string
    data: Record<string, any>
  }) => void
}


export async function main() {
  const cwd = process.cwd()
  const argv = minimist(process.argv.slice(2))
  let [type, projectPath] = argv._ as [TemplateType | undefined, string | undefined]

  if (!types.includes(type)) {
    console.log(`${red('x')} 项目类型${type ? type : ''}不存在，请重新选择`)
    type = undefined
  }
  if (!type) {
    const { type: _type } = await prompt<{ type: TemplateType }>([
      {
        type: 'list',
        name: 'type',
        message: '选择项目类型',
        choices: [
          { name: 'H5', value: 'h5' },
          { name: 'react', value: 'react' },
          { name: 'express', value: 'express' },
          { name: 'lib库', value: 'lib' },
          { name: 'vue组件', value: 'vue-component' },
        ],
      },
    ])
    type = _type
  }

  if (!projectPath) {
    const { projectName: _projectPath } = await prompt<{ projectName: string }>([
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称(projectName)',
      },
    ])
    projectPath = _projectPath
  }
  
  const projectName = projectPath
  projectPath = path.resolve(cwd, projectName)

  if (!isDirEmpty(projectPath, true)) {
    const { overwrite } = await prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: '目标文件夹不为空，是否选择覆盖',
      },
    ])
    if (!overwrite) {
      console.log(red(`取消创建项目`))
      return
    }
  }
  const config = templateConfig[type]
  const templateRemote = config.repo;
  if (templateRemote) {
    spawnSync(`git clone ${templateRemote} ${projectName}`, {
      stdio: 'inherit',
      shell: true,
      cwd
    });

    spawnSync(`rm -rf .git && git init`, {
      stdio: 'inherit',
      shell: true,
      cwd: path.resolve(cwd, projectName)
    });
    
    if (config.after) {
      config.after({
        cwd: path.resolve(cwd, projectName),
        type,
        projectName
      });
    }
  } else {
    console.log(red(`当前项目类型下还没有模板`))
    return
  }

  console.log(green(`\r cd ${projectName}`))
  console.log(green(`\r 安装完成!!!!`))
}
