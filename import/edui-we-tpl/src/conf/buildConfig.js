const _  = require('lodash');
const fs = require('fs');
const path = require('path');
let outAssetsDirectory = 'static';
let uiPublicConfig = require('../../uipublic/config');

const resolve = function (dir) {
  return path.join(process.cwd(), ...dir.split("/"));
};

// taki编译项目时的配置文件
module.exports = {
  // 模式
  model :                               'file',
  // 配置process.env.NODE_ENV的值,因为很多webpack的插件是依赖这个值,一般有production和development
  nodeDev:                              'development',
  // 自动维护图标
  icon:[
    {
      // 暂时只支持使用阿里巴巴图标库
      aliUrl:uiPublicConfig.baseAliUrl,
      // 公共图标
      dir:'uipublic/components/lib/cd-icon'
    }
  ],

  // 是否自动生成路由
  autoGeneratorRouter:true,
  // 自动生成代码
  generator:[
    // 在项目公共代码目录中生成生态公共代码的代理模块
    {
      // 自动生成器的类型,有wrapper和index,分别为生成代理模块和生成模块的index.js
      type:'wrapper',
      // 被操作目录
      srouce:resolve("uipublic/common/lib"),
      // 生成目录
      target:resolve("src/common/lib"),
      // 生成的代理模块中import的模块
      importModule:'_com@',
      // 注释,支持换行
      // note:'',
      // 过滤器,代理每个自模块时,会判断是否通过该过滤器。
      // 过滤器是一个函数,会传递每个自模块的名字,函数需要返回true或者false来
      filter:function(item){
        if( _.startsWith(item,".")) return false;
        let stat = fs.statSync(path.join(resolve("uipublic/common/lib"),item));
        if(stat.isDirectory()) return true;
        return _.endsWith(item,".js");
      }
    },
    {
      type:'wrapper',
      srouce:resolve("uipublic/components/lib"),
      target:resolve("src/components/lib"),
      importModule:'_comp@',
      filter:function(item){
        if( _.startsWith(item,".")) return false;
        let stat = fs.statSync(path.join(resolve("uipublic/components/lib"),item));
        if(stat.isDirectory()) return true;
        return _.endsWith(item,".js");
      }
    },
    {
      type:'wrapper',
      srouce:resolve("uipublic/mixins/lib"),
      target:resolve("src/mixins/lib"),
      importModule:'_mixins@',
      filter:function(item){
        if( _.startsWith(item,".")) return false;
        let stat = fs.statSync(path.join(resolve("uipublic/mixins/lib"),item));
        if(stat.isDirectory()) return true;
        return _.endsWith(item,".js");
      }
    },
    {
      type:'wrapper',
      srouce:resolve("uipublic/directive/lib"),
      target:resolve("src/directive/lib"),
      importModule:'_dire@',
      filter:function(item){
        if( _.startsWith(item,".")) return false;
        let stat = fs.statSync(path.join(resolve("uipublic/directive/lib"),item));
        if(stat.isDirectory()) return true;
        return _.endsWith(item,".js");
      }
    },
    {
      // 自动生成器的类型,有wrapper和index,分别为生成代理模块和生成模块的index.js
      type:'index',
      // 操作目录
      target:resolve('src/conf/custom'),
      filter:function(file){
        return  _.startsWith(file,'.') ? false :
          _.endsWith(file,'.js') ? true :
            fs.lstatSync( path.posix.join(resolve('src/conf/custom'),file) ).isDirectory();
      }
    }
  ],
  // 是否将css单独抽离出一个文件
  extract:                              false,
  // 入口文件,如果有多个,请配置多个
  // 具体可以查看https://webpack.js.org/configuration/entry-context/#entry,
  // 这里需要注意的是,必须配置为object { <key>: string | [string] }
  entry:{
    app:                                resolve('src/main.js'),
  },
  // 输出项,具体可以查看https://webpack.js.org/configuration/output/
  output:{
    path:       resolve('dist'),
    filename:   '[name].js',
    // 配置文件服务器,CDN之类的
    publicPath: '/'
  },
  // 输出项中存放资源的文件夹
  outAssetsDirectory,
  // 命名别名,改别名可以在模块导入中使用(import,require语句中使用,便面文件路径出错)
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '_@': resolve('uipublic'),
    '_com@': resolve('uipublic/common'),
    '_comp@': resolve('uipublic/components'),
    '_mixins@':resolve('uipublic/mixins'),
    '_dire@':resolve('uipublic/directive'),
    '@': resolve('src'),
    'api@':resolve('src/api'),
    'assets@': resolve('src/assets'),
    'scss@': resolve('src/assets/scss'),
    'com@': resolve('src/common'),
    'utl@': resolve('src/common/utl'),
    'comp@': resolve('src/components'),
    'conf@':resolve('src/conf'),
    'mixins@':resolve('src/mixins'),
    'dire@':resolve('uipublic/directive'),
    'page@':resolve('src/page'),
  },
  // 图片文件最小大小,小于这个大小,将会以base64文件加载到js中,大于则以文件
  imgMinSize:10000,
  // 字体文件最小大小,小于这个大小,将会以base64文件加载到js中,大于则以文件
  fontMinSize:10000,
  // webpack生成js文件时是不是生成映射文件
  sourceMap:  true,
  // 配置css-loader选项,具体请看https://www.npmjs.com/package/css-loader
  css: {
    minimize:     true,
    sourceMap:    true
  },
  // 配置postcss-loader,具体选项请看https://www.npmjs.com/package/postcss-loader
  postcss: {
    sourceMap:    true
  },
  // 配置less-loader,具体选项请看https://www.npmjs.com/package/less-loader
  less:{
    sourceMap:    true
  },
  // 使用sass-loader,具体请看https://www.npmjs.com/package/sass-loader
  scss :{
    includePaths:[resolve('src/assets/scss')],
    //  src/assets/scss中必须有个base的样式文件
    data: "@import 'base';",
    sourceMap:    true
  },
  // 配置stylus-loader,具体请看:https://www.npmjs.com/package/stylus-loader
  stylus:{
    sourceMap:    true
  },
  // 配置vue-loader,具体请看: https://www.npmjs.com/package/vue-loader
  vue:{
  },
  // 配置babel,当前只支持include属性,默认有src,uipublic,test
  babel:{
    include:function (resolve) {
      return [resolve('node_modules/muse-ui')];
    }
  },
  // 配置的常量,该常量现在发现只能在脚本中使用
  $constant:{
  },
  // 入口html输出名字
  htmlName:'index.html',
  // 入口html模版
  htmlTemplate: resolve('index.html'),
  // 不同环境,可以配置不同环境下单独的选项,环境中的选项将会替换掉外面的选项
  env: {
    dev:{
      NODE_ENV:           'development',
      model :             'browser',
      // 浏览器端口,只有在model=browser时有用
      port:               '10020',
      // 是否自动打开浏览器,只有在model=browser时有用
      autoOpenBrowser:    true,
      // 网址代理
      proxyTable:         {},
      extract:            false,
    },
    prod:{
      NODE_ENV:           'production',
      model :             'file',
      extract:              true,
      entry:{
        app:                                resolve('src/main.js'),
        // 第三方包单独打包出来,名字必须为vendor
        vendor:                             ['vue', 'vue-router', 'vuex','moment','qs','axios']
      },
      output:{
        path:               resolve('dist'),
        filename:           path.posix.join(outAssetsDirectory, 'js/[name].[chunkhash].js'),
        chunkFilename:      path.posix.join(outAssetsDirectory, 'js/[id].[chunkhash].js')
      },
      // html压缩,更多配置请看https://github.com/kangax/html-minifier#options-quick-reference
      // 只有在model=file时有用
      HTMLMinifier:{
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // 是否将资源做GZIP压缩,只有在model=file时有用
      productionGzip:true,
      // 压缩文件类型,只有在model=file时有用
      productionGzipExtensions: ['js', 'css'],
      // 是否生成打包文件分析报告
      bundleAnalyzerReport:   false,
    },
    local:{
      NODE_ENV:           'production',
      model :             'file',
    }
  },
};
