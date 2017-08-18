const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const I18n = require('../src/I18n');

describe('I18n', () => {
  it('constructor should fail if called with no parameters', () => {
    expect(() => new I18n()).to.throw(Error);
  });
});
