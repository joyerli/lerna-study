#!/usr/bin/env node
const program = require('commander');
const appInfo = require('./../package.json');
const utl = require('./../utl');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 *  设置版本
 */

program.version(appInfo.version);

/**
 * 读取当前配置
 */
// 读取当前项目下的配置
let projectConfig = require(utl.resolve('edui-cli.json'));
// 读取默认配置
let defaultConfig = require('./../config.json');
let config = Object.assign({},defaultConfig,projectConfig);
// 根据命名空间转换配置
config = Object.keys(config).reduce(( old, key ) => {
  let keys = key.split(".");
  let namespace;
  let subKey;

  if(keys.length === 2){
    namespace = keys[0];
    subKey = keys[1];
  }else if(keys.length < 2){
    subKey = keys[0];
  }else if(keys.length > 2) {
    namespace = keys[0];
    subKey = keys.slice(1,keys.length).join(".");
  }
  if(namespace) {
    if(!old[namespace]) old[namespace] = {};
    old[namespace][subKey] = config[key];
  }else {
    old[subKey] = config[key];
  }

  return old;
},{});

//如果有关于UI的配置,修改edui的配置
if(config.ui && utl.existEdui()) {
  require('edui/config/update')(config.ui);
}

/**
 * 保存配置
 */
process.CLI_CONFIG = config;

// 检查版本

/**
 * 设置命令
 */
// 动态加载组件
const commandList = require('./../utl/load-command');
commandList.forEach(function (command) {
  command(program);
});

program.parse(process.argv);
