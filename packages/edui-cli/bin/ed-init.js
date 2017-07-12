const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');

module.exports = function (program) {
  
  program
  //子命令
    .command('init [uiPublicUrl] ')
    //短命令 - 简写方式
    .alias('i')
    //说明
    .description('初始化一个edui项目')
    // 使用淘宝镜像
    .option("-t, --taobao", "使用淘宝镜像")
    //注册一个callback函数
    .action(function(uiPublicUrl,meta){
      let _uiPublicUrl = uiPublicUrl || process.CLI_CONFIG.uiPublicUrl;
      
      if(!_uiPublicUrl){
        console.log(chalk.red("Need to set uiPublicUrl."));
        return;
      }
  
      var child = spawn('git', ['clone', _uiPublicUrl,'uipublic'], {
        stdio: 'inherit',
        cwd:process.cwd()
      });
      
      child.on("exit",function () {
        spawn('npm',
            meta.taobao ?
                ['--registry','https://registry.npm.taobao.org','install'] :
                ['install'],
            {
              stdio: 'inherit',
              cwd:process.cwd()
            });
      })
    });
};