const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function (program) {
  //像git风格一样的子命令
  program
  //子命令
    .command('config [option] [value]')
    //短命令 - 简写方式
    .alias('c')
    //说明
    .description('查看edui-cli的配置信息')
    // config的选项
    .option("-t, --type [type]", "设置值的数据类型",'string')
    //注册一个callback函数
    .action(function(option,value,meta){
      let config = require('./../config.json');
      if(option){
        if(value) {
          switch (meta.type) {
            case 'string':
              config[option] = value + '';
              break;
            case 'boolean':
              config[option] = value+'' === 'true';
              console.log(config[option]);
              break;
            case 'int':
              config[option] = parseInt(value);
              break;
            case 'float':
              config[option] = parseFloat(value);
              break;
            default:
              config[option] = value + '';
              break;
          }
        } else delete config[option];

        let newConfigStr = JSON.stringify(config, null, 2);
        let configPath = path.join(__dirname, ...'./../config.json'.split("/"));
        fs.writeFileSync(configPath, newConfigStr);

      } else console.log(chalk.green(JSON.stringify(config, null, 2)));

    })
    .on('--help', function() {
      //这里输出子命令的帮助
      console.log();
      console.log();
      console.log('  config命令案例:');
      console.log();
      console.log('    #修改或者添加一个配置');
      console.log('    $ ed config tpl.pcBlack www.baidu.com');
      console.log();
      console.log('    #清空一个配置');
      console.log('    $ ed config tpl.pcBlack');
      console.log();
      console.log('    #设置一个特殊数据类型的配置');
      console.log('    $ ed config cli.updateCheck false -t boolean');
      console.log();
    });
};