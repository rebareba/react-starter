// 这个配置需要与eslint一致，否则在启用 eslint auto fix 的情况下会造成冲突
module.exports = {
  "printWidth": 120, //一行的字符数，如果超过会进行换行，默认为80
  "tabWidth": 2,
  "useTabs": false, // 注意：makefile文件必须使用tab，视具体情况忽略
  "singleQuote": true,
  "semi": false,
  "trailingComma": "all", //是否使用尾逗号，有三个可选值"<none|es5|all>"
  "bracketSpacing": false, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  // "jsxBracketSameLine": true,
  // "arrowParens": "avoid",
  // "insertPragma": true,
  "endOfLine": "auto", // window和mac的文件最后一行默认换行不一样问题
};