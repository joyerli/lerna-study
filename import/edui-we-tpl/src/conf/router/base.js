let routerList = [];

// 默认
routerList.push({
  path: '*',
  name:'index',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('../../page/main/main.vue'))
    }, 'index')
  }
});

export default routerList;
