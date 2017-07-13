const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const utl = require('./../utl');
const render = require('json-templater/string');
const downGitRepo = require('download-git-repo');

module.exports = function (program) {
    program
        // 命令
        .command('create <name> [tpl]')
        // 短命令 - 简写方式
        .alias('C')
        // 说明
        .description('创建项目,页面,组件,模块模版')
        // 选项
        .option("-P, --project", "创建项目")
        .option("-p, --page", "创建页面")
        .option("-c, --component", "创建组件")
        .option("-m, --mod", "创建页面模块")
        // 在创建页面和的页面模块有用,值只能为相对于src/page的相对路径
        .option("-d, --dir [dir]", "目标目录")
        // 在创建组件时有用,为组件的前缀
        .option("-f, --prefix [prefix]", "组件的前缀")
        //注册一个callback函数
        .action(function(name,tpl,meta){
            function loadPageOrMod(type,genRenderParamsFn) {
                let _tpl = tpl ? tpl : type === "page" ? process.CLI_CONFIG.pageTpl : process.CLI_CONFIG.modTpl;
                const tplFullPath = utl.resolve(_tpl);
                const pathType = utl.pathType(tplFullPath);
                switch (pathType) {
                    case utl.PathType.FILE:
                        let dirPath = meta.dir ? meta.dir +"/" : "";
                        let mod = type === "page" ? "" : ".md";
                        let outPath = _.startsWith(process.cwd(),utl.resolve( "src/page")) ?
                            path.join(process.cwd(),...`${dirPath}${name}${mod}.vue`.split("/")) :
                              path.join(utl.resolve( `src/page/${dirPath}${name}${mod}.vue`));
                        
                        let tplStr = fs.readFileSync(tplFullPath,{encoding:'utf-8'});
                        let renderParams = {
                            'path':outPath.split('src/page').pop(),
                            'name':name,
                            'name.upperFirst':_.upperFirst(name),
                            'name.camelCase':_.camelCase(name),
                            'name.kebabCase':_.kebabCase(name),
                            'name.lowerCase':_.lowerCase(name),
                            'name.lowerFirst':_.lowerFirst(name),
                            'name.snakeCase':_.snakeCase(name),
                            'name.startCase':_.startCase(name),
                            'name.upperCase':_.upperCase(name)
                        };
                        let cont = render(tplStr,Object.assign({},renderParams,genRenderParamsFn ? genRenderParamsFn(outPath):{}));
                        
                        fs.writeFileSync(outPath, cont);
                        break;
                    case utl.PathType.DIR:
                        console.log(chalk.red("The template should be file."));
                        break;
                    default:
                        console.log(chalk.red("The template does not exist."));
                        break;
                }
            }
            
            // 创建项目
            if(meta.project){
                const tplConfig = process.CLI_CONFIG.projectTpl;
                const npmConfig = process.CLI_CONFIG.npm;
                tpl = tpl || 'pcBlank';
                let projectGithubUrl = tplConfig && tplConfig[tpl] ? tplConfig[tpl] : tpl;
                
                console.log(chalk.green(`Start download code...`));
                
                downGitRepo( projectGithubUrl , name, err => {
                    
                    if(err) {
                        console.log(chalk.red(`Download code(${projectGithubUrl}) failed.`));
                        return;
                    }
    
                    console.log(chalk.green(`success...`));
                    const projectPackagePath = path.join(process.cwd(),name+'/package.json');
                    // 修改下载下来的package文件
                    let projectInfo = require(projectPackagePath);
                    projectInfo.name = name;
                    projectInfo = Object.assign({},projectInfo,npmConfig);
                    let out = JSON.stringify(projectInfo, null, 2);
                    fs.writeFileSync(projectPackagePath, out);
                });
    
                
                
                
            }
            
            // 创建页面
            if(meta.page) loadPageOrMod("page");
            
            // 创建组件
            if(meta.component) {
                let componentTpl = tpl ? tpl : process.CLI_CONFIG.componentTpl;
                const componentTplFullPath = utl.resolve(componentTpl);
                const pathType = utl.pathType(componentTplFullPath);
                switch (pathType) {
                    case utl.PathType.FILE:
                        const prefix = meta.prefix ? meta.prefix + "-" : "ed-";
                        const outDir = utl.resolve( `src/components/lib/${prefix}${name}`)
                        const indexPath = path.join(outDir,"index.js");
                        const componentPath = path.join(outDir,`${name}.vue`);
                        
                        // 判断文件夹是否存在
                        if(fs.existsSync(outDir)){
                            console.log(chalk.red("Component already exists."));
                            break;
                        }
                        
                        // 生成文件夹
                        fs.mkdirSync(outDir);
                        
                        // 生成index.js
                        const indexStr = `import {{name}} from './{{name}}';\nexport default {{name}};`
                        const indexCont = render(indexStr,{name});
                        fs.writeFileSync(indexPath, indexCont);
                        
                        // 生成组件
                        let componentName = prefix+name;
                        const componentStr = fs.readFileSync(componentTplFullPath,{encoding:'utf-8'});
                        const componentCont = render(componentStr,{
                            name,
                            'name.upperFirst':_.upperFirst(name),
                            'name.camelCase':_.camelCase(name),
                            'name.kebabCase':_.kebabCase(name),
                            'name.lowerCase':_.lowerCase(name),
                            'name.lowerFirst':_.lowerFirst(name),
                            'name.snakeCase':_.snakeCase(name),
                            'name.startCase':_.startCase(name),
                            'name.upperCase':_.upperCase(name),
                            componentName,
                            'componentName.upperFirst':_.upperFirst(componentName),
                            'componentName.camelCase':_.camelCase(componentName),
                            'componentName.camelCase.upperFirst':_.upperFirst(_.camelCase(componentName)),
                            'componentName.kebabCase':_.kebabCase(componentName),
                            'componentName.lowerCase':_.lowerCase(componentName),
                            'componentName.lowerFirst':_.lowerFirst(componentName),
                            'componentName.snakeCase':_.snakeCase(componentName),
                            'componentName.startCase':_.startCase(componentName),
                            'componentName.upperCase':_.upperCase(componentName)
                        });
                        
                        fs.writeFileSync(componentPath, componentCont);
                        break;
                    case utl.PathType.DIR:
                        console.log(chalk.red("The component template should be file."));
                        break;
                    default:
                        console.log(chalk.red("The component template does not exist."));
                        break;
                }
            }
            
            // 创建模块
            if(meta.mod) {
                loadPageOrMod("mod",(outPath) => {
                    
                    let modName = outPath.split("src/page")
                        .pop()
                        .split("/")
                        .filter((item)=>{
                            return !!item;
                        })
                        .map((item)=>{
                            let isMod = _.endsWith(item,".md.vue");
                            let _item = item.split("_")[0].split(".")[0];
                            if(isMod) _item = "md-"+_item;
                            return _item;
                        })
                        .join("__");
                    
                    return {modName,
                        'modName.upperFirst':_.upperFirst(modName),
                        'modName.camelCase':_.camelCase(modName),
                        'modName.camelCase.upperFirst':_.upperFirst(_.camelCase(modName)),
                        'modName.kebabCase':_.kebabCase(modName),
                        'modName.lowerCase':_.lowerCase(modName),
                        'modName.lowerFirst':_.lowerFirst(modName),
                        'modName.snakeCase':_.snakeCase(modName),
                        'modName.startCase':_.startCase(modName),
                        'modName.upperCase':_.upperCase(modName)
                    };
                });
            };
        });
};