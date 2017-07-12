const spawn = require('cross-spawn');

module.exports = function (program) {
  program
  //子命令
    .command('build <env>')
    //短命令 - 简写方式
    .alias('b')
    //说明
    .description('按照指定的环境构建当前项目')
    //注册一个callback函数
    .action(function(env){
      require('../../edui')({env});
    })
}
