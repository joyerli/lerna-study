const fs = require('fs');
const utl = require('./../utl');
const _ = require("lodash");

const commandList = fs
  .readdirSync(utl.localResolve("bin"))
  .filter( file => _.endsWith(file,".js" ) ?file !== "ed.js":false)
  .map(file => require('./../bin/'+file) );

module.exports = commandList;