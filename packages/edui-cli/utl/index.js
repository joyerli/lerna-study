const path = require('path');

/**
 * 获取相对于执行命令的项目根目录的目录的绝对路径。
 * @param dir 目标目录
 * @return {string}
 */
exports.resolve = function (dir) {
  return path.join(process.cwd(), ...dir.split("/"));
};

/**
 * 获取相对于当前脚本项目根目录的目录的绝对路径。
 * @param dir 目标目录
 * @return {string}
 */
exports.localResolve = function (dir) {
  return path.join(__dirname, '..', ...dir.split("/"));
};