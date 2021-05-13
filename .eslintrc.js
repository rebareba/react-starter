const path = require('path')
/* 解析路径 上一级目录 */
const resolve = (dir) => {
  return path.join(__dirname, dir)
}

module.exports = {
  // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  // 一个配置文件可以被基础配置中的已启用的规则继承。
  extends: ['airbnb', 'eslint:recommended', 'plugin:prettier/recommended'],
  // 自定义全局变量
  globals: {
    window: true,
    '@': true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', resolve('.')],
          ['@src', resolve('src')],
          ['@pages', resolve('src/pages')],
          ['@models', resolve('src/models')],
          ['@components', resolve('src/components')],
          ['@utils', resolve('src/utils')],
          ['@i18n', resolve('src/i18n')],
          ['@icons', resolve('src/icons')],
          ['@common', resolve('src/common')],
          ['@assets', resolve('src/assets')],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  // ESLint 默认使用Espree作为其解析器，你可以在配置文件中指定一个不同的解析器
  parser: 'babel-eslint',
  // 配置解析器支持的语法
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。
  // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀。
  plugins: [
    'react',
    'prettier',
    // "@typescript-eslint"
  ],
  // ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：
  // "off" 或 0 - 关闭规则
  // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
  rules: {
    semi: 0,
    'no-unused-vars': [
      1,
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_|^err|^ev', // _xxx, err, error, ev, event
      },
    ],
    'import/no-extraneous-dependencies': 0, // 直接引用非package.json的依赖
    'no-useless-escape': 2,
    'react/prefer-stateless-function': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0, // 这个是组件的属性
    'jsx-a11y/alt-text': 0, // 这个是图片的alt填写
    'no-param-reassign': 0, // 参数重新复制
    'react/jsx-props-no-spreading': 0, // 'react 解构...'
    'import/no-named-as-default': 0, // 装饰期会报错
    'import/no-named-as-default-member': 0,
    'no-bitwise': 0, // 二进制运算
    'react/no-access-state-in-setstate': 0, // 设置state使用原先的state
    'class-methods-use-this': 0, // class 方法中必须使用到this
    'no-return-assign': 0, // 不能返回一个赋值操作
    'react/sort-comp': 0, // 方法定义的顺序
    'react/static-property-placement': 0, // 关于静态属性和方法的定义地方
    'jsx-a11y/click-events-have-key-events': 0, //
    'jsx-a11y/anchor-is-valid': 0, //
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'prefer-destructuring': 0, // 优先使用解构赋值
    'react/no-deprecated': 0,
    'no-plusplus': 0,
    'react/no-array-index-key': 0, // 不能使用index作为key
    'import/no-cycle': 0,
    'react/react-in-jsx-scope': 0,
  },
}
