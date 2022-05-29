import vueComponentAfter from "./vue-component-after";


export type TAfterParams = {
  cwd: string
  type: string,
  projectName: string
}

type TConfig = {
  repo: string,
  after?: (options: TAfterParams) => void
}

type TTemplateConfig = {
  [x: string]: TConfig
}

export const templateConfig: TTemplateConfig = {
  h5: {
    repo: 'git@github.com:naihe138/vite-ts-template.git',
  },
  react: {
    repo: 'git@github.com:naihe138/vite-react-templage.git'
  },
  express: {
    repo: 'git@github.com:naihe138/ts-express-template.git'
  },
  lib: {
    repo: 'git@github.com:naihe138/ts-lib-template.git'
  },
  'vue-component': {
    repo: 'git@github.com:naihe138/vue-component-template.git',
    after: vueComponentAfter
  }
}

