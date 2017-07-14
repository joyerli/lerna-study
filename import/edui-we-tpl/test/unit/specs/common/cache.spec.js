import { parser,clear,del,get,set} from "../../../../src/common/cache";
import {assert} from 'chai'
import Cookies from 'js-cookie'

describe('common.cache.js.clear():', () => {
  it('清除localStorage', () => {
    window.localStorage.setItem("key","value");
    clear();
    assert(window.localStorage.getItem("key") !== 'value','清除localStorage失败');
  });
  it('清除sessionStorage', () => {
    window.sessionStorage.setItem("key","value");
    clear();
    assert(window.sessionStorage.getItem("key") !== 'value','清除sessionStorage失败');
  });
  it('清除cookie', () => {
    Cookies.set("key","value");
    clear();
    assert(Cookies.get("key") !== 'value','cookie清除失败');
  });
});

describe('common.cache.js.del():', () => {
  beforeEach(clear);
  it('删除永久', () => {
    window.localStorage.setItem("key","value");
    del("key");
    assert(!window.localStorage.getItem("key"),'删除永久');
  });
  it('删除暂存', () => {
    window.sessionStorage.setItem("key","value");
    del("key");
    assert(!window.sessionStorage.getItem("key"),'删除暂存');
  });
  it('删除有期限值', () => {
    Cookies.set("key","value",{expires: 7});
    window.localStorage.setItem("key","value");
    del("key");
    assert(!Cookies.get("key"),'删除有期限值');
  });
});

describe('common.cache.js.get():',() => {
  beforeEach(clear);
  it('从localStorage中获取', () => {
    window.localStorage.setItem("key",parser().format("joyer"));
    assert(get("key") === "joyer","从localStorage中获取失败");
  });
  it('从sessionStorage中获取', () => {
    window.sessionStorage.setItem("key",parser().format("sessionStorage"));
    assert(get("key") === "sessionStorage","从sessionStorage中获取失败");
  });
  it('从Cookies中获取', () => {
    Cookies.set("key",parser().format("Cookies"),{expires: 7});
    assert(get("key") === "Cookies","从Cookies中获取失败");
  });
});

describe('common.cache.js.set():', () => {
  beforeEach(clear);
  it('默认添加', () => {
    set('key',123);
    assert(parser().parse(window.localStorage.getItem("key")) === 123 &&
      !window.sessionStorage.getItem("key") &&
      !Cookies.get("key"),"默认添加失败");
    set('key2',"123");
    assert(parser().parse(window.localStorage.getItem("key2")) === "123" &&
      !window.sessionStorage.getItem("key2") &&
      !Cookies.get("key2"),"默认添加失败");
  });
  it('有效期', (done) => {
    set('key1','123',1);
    assert(!window.localStorage.getItem("key1") &&
      !window.sessionStorage.getItem("key1") &&
      parser().parse(Cookies.get("key1")) === "123","默认添加失败");
    setTimeout(function () {
      assert(!window.localStorage.getItem("key1")&&
        !window.sessionStorage.getItem("key1") &&
        !Cookies.get("key1"),"默认添加失败");
      done();
    },1500);
  });
  it('暂存', () => {
    set('key','123',0);
    assert(!window.localStorage.getItem("key") &&
      parser().parse(window.sessionStorage.getItem("key")) === "123" &&
      !Cookies.get("key"),"暂存测试失败");
  });
  it('永久', () => {
    set('key','123');
    assert(parser().parse(window.localStorage.getItem("key")) === "123" &&
      !window.sessionStorage.getItem("key") &&
      !Cookies.get("key"),"永久测试失败");
  });
  it('覆盖', () => {
    set('key','123');
    assert(set('key','456') &&
      parser().parse(window.localStorage.getItem("key")) === "456" &&
      !window.sessionStorage.getItem("key") &&
      !Cookies.get("key"),"默认");
    assert(set('key','456',0) &&
      !window.localStorage.getItem("key") &&
      parser().parse( window.sessionStorage.getItem("key") ) === "456" &&
      !Cookies.get("key"),"修改有效期到暂存");
    assert(set('key','456',1) &&
      !window.localStorage.getItem("key") &&
      !window.sessionStorage.getItem("key") &&
      parser().parse( Cookies.get("key") ) === "456" ,"修改有效期");
    assert(set('key','789',0) &&
      !window.localStorage.getItem("key") &&
      parser().parse( window.sessionStorage.getItem("key") ) === "789" &&
      !Cookies.get("key"),"修改有效期到暂存和修改值");
    assert( !set('key','456',-1,false) &&
      !window.localStorage.getItem("key") &&
      parser().parse( window.sessionStorage.getItem("key") ) === "789" &&
      !Cookies.get("key"),"不覆盖修改到永久");
    assert( !set('key','456',0,false) &&
      !window.localStorage.getItem("key") &&
      parser().parse( window.sessionStorage.getItem("key") ) === "789" &&
      !Cookies.get("key"),"不覆盖修改到暂存");
    assert( !set('key','456',1,false) &&
      !window.localStorage.getItem("key") &&
      parser().parse( window.sessionStorage.getItem("key") ) === "789" &&
      !Cookies.get("key"),"不覆盖修改到有效期");
    assert(set('key2','456',-1,false) &&
      parser().parse(window.localStorage.getItem("key2")) === "456" &&
      !window.sessionStorage.getItem("key2") &&
      !Cookies.get("key2"),"不覆盖设置新值");
  });
});
