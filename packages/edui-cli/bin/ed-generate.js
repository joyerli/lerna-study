const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const utl = require('../utl');

const TYPE = {
    ICON:"icon",
    ROUTE:"route",
    INDEX:"index",
    
    MOCK:"mock"
};

const genTypeGateway = {
    icon(eduiPath) {
        require(path.join(eduiPath,"icon"));
    },
    route(eduiPath) {
        require(path.join(eduiPath,"gen","gen-router"));
    },
    index(eduiPath) {
        require(path.join(eduiPath,"gen","gen-index"));
    },
    wrapper(eduiPath) {
        require(path.join(eduiPath,"gen","gen-wrapper"));
    },
    mock(eduiPath) {
        require(path.join(eduiPath,"api-mock"));
    }
};

module.exports = function (program) {
    
    program
    //子命令
        .command('gen [type] ')
        //短命令 - 简写方式
        .alias('g')
        //说明
        .description('初始化一个edui项目')
        // 使用淘宝镜像
        .option("-t, --taobao", "使用淘宝镜像")
        //注册一个callback函数
        .action( function(type) {
            let actuator = genTypeGateway[type];
            if( !actuator ) throw "You don't say what type, how do I know what you build? " +
            "You can specify like icon router,index,wrapper.";
            
            if(!utl.existEdui()) throw "EDUI does not exist. You need to execute npm install edui --save";
    
            actuator(utl.getEduiPath());
            
        });
};