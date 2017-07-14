import utl from "../../../../src/common/utl";
import {expect} from 'chai'
describe('common.array.js.notEmpty():', () => {
  it('测试空数组', () => {
    expect(utl.array.notEmpty([])).to.be.false;
  });
  it('测试不是数组', () => {
    expect(utl.array.notEmpty({})).to.be.false;
  });
  it('测试不为空数组', () => {
    expect(utl.array.notEmpty([1,2,3])).to.be.true;
  });
});
