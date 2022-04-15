# cli

## 使用

```sh
npx @naice/create [type] # h5 | react | express | lib

npx @naice/create h5 # h5 项目
npx @naice/create react # react项目
npx @naice/create express # express框架
npx @naice/create lib # npm 包项目
```

or

```sh
npm init @naice [type] # h5 | miniapp | wcf | lib

npm init @naice h5 # h5 项目
npm init @naice miniapp # 小程序项目
npm init @naice wcf # 云函数
npm init @naice lib # npm 包项目
```

or

```sh
yarn create @naice [type] # h5 | miniapp | wcf | lib

yarn create @naice h5 # h5 项目
yarn create @naice miniapp # 小程序项目
yarn create @naice wcf # 云函数
yarn create @naice lib # npm 包项目
```

## 更新模板

`templates` 目录对应类型下建立模板

如 H5 下创建模板文件夹

- templates
  - h5
    - default # 默认模板文件夹
    - typescript # ts 模板文件夹
  - lib
    - default # 默认模板文件夹
  - miniapp
    - default # 模板文件夹
    - typescript # ts 模板文件夹

### 用户变量

模板文件夹支持 `create.config.js` 配置文件，来指定需要用户输入的变量。这些变量支持使用 `ejs` 的形式在模板文件中替换。

它的结构为:

```js
// create.config.js
module.exports = {
  prompts: Prompts[]
  include: string[]
}

```

- **prompts：** 用户交互选项  
  使用了 `Inquirer` 来支持终端交互，具体选项查看[Inquirer 文档](https://github.com/SBoudrias/Inquirer.js)
  默认内置了 `projectPath`, `projectName` 两个变量
- **include：** 需要支持变量替换的文件，支持 glob
  填写相对模板根目录的路径
- **after：** 结束钩子  
  用于自定义操作, 提供了下列参数
  - cwd: 运行目录
  - type: 模板类型
  - template: 模板源码目录
  - dest: 目标目录，项目生成目录
  - data: 用户输入的数据

**使用示例：**

如 `templates/miniapp/default` 中有如下 `create.config.js` 文件

```js
// create.config.js
module.exports = {
  prompts: [
    // 需要用户输入 appid
    {
      type: 'input',
      name: 'appId',
      message: '请输入 appId',
    },
  ],
  include: ['project.config.json'],
  after({ cwd, type, template, dest, data }) {
    console.log(dest)
    fs.writeFileSync(path.join(dest, 'test.js'), 'test after')

    ...do something
  },
}
```

```json
{
  "appid": "<%= appid %>"
}
```

//

### 特殊文件名

"`__`" 双下划线开头的文件生成创建模板时将会去掉双下划线。如：`__package.json` 将会生成 `package.json`。

这么做是为了避免某些情况下项目模板中的某些配置文件影响到当前项目。
