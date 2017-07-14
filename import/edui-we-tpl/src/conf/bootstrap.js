/**
 * 引导程序,会在程序的启动时开始运行。
 */

import Vue from 'vue'
import App from './App'
// 引入路由
import router from './router'
// 引用状态
import store from './store'

// 本地化操作
import * as custom from './custom';

let beforeList = [];
let afterList = [];

for(let key of Object.keys(custom)){
  let cus = custom[key];
  if(cus.before) beforeList.push(cus.before);
  if(cus.after) afterList.push(cus.after);
}

export default () => {
  for(let before of beforeList){
    before();
  }
  let vue = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
  for(let after of afterList){
    after({vue,router,store});
  }
}
