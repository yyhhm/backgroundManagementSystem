
module.exports = {
    tabWidth: 4, // 会忽略vetur的tabSize配置
    useTabs: false, // 是否利用tab替代空格
    singleQuote: true, // 使用单引号而不是双引号
    jsxSingleQuote: true,
    semi: false, // 句尾是否加;
    trailingComma: 'es5', // es5多行时，尽可能打印尾随的逗号
    arrowParens: 'avoid', // allow paren-less arrow functions 箭头函数的参数使用圆括号
    endOfLine: 'lf', // 换行符校验
    jsxBracketSameLine: true, // #多行JSX中的>放置在最后一行的结尾，而不是另起一行（默认false）
    bracketSpacing: true,
    proseWrap: 'always', // 换行,always：超过printWidth就换行，never：不换行，preserve：按照原样处理
    printWidth: 220,
}
