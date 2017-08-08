const path = require('path');
const fs = require('fs');

/**
 * 获取相对于执行命令的项目(执行命令的指令所在的npm项目)根目录的目录的绝对路径。
 * 如果当前目录不在一个npm项目中,那么会返回当前目录。
 * @param dir 目标目录
 * @return {string}
 */
exports.resolve = function (dir) {
  function getProjectPath(dirPath) {
    if(path.dirname(dirPath) === dirPath)
      return process.cwd();
    return fs.existsSync(path.join(dirPath,"package.json")) ? dirPath : getProjectPath(path.dirname(dirPath));
  }
  return path.join(getProjectPath(process.cwd()), ...dir.split("/"));
};

/**
 * 获取相对于当前脚本项目根目录的目录的绝对路径。
 * @param dir 目标目录
 * @return {string}
 */
exports.localResolve = function (dir) {
  return path.join(__dirname, '..', ...dir.split("/"));
};


/**
 * 路径的类型,有空,文件,目录。
 * @type {{NONE: number, FILE: number, DIR: number}}
 */
exports.PathType = {
  NONE:0,
  FILE:1,
  DIR:2
};

/**
 * 判断路径的类型,返回PathType的值。
 * @param path
 * @return {number}
 */
exports.pathType = function (path) {
  if(fs.existsSync(path)){
    let stat = fs.statSync(path);
    return stat.isDirectory() ? exports.PathType.DIR : exports.PathType.FILE;
  }
  return exports.PathType.NONE;
};

/**
 * 判断edui是否存在
 * @return {*}
 */
exports.existEdui = function () {
  return fs.existsSync(exports.resolve("node_modules/edui"))
};

exports.getEduiPath = function () {
  return exports.resolve("node_modules/edui");
};