const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const i18n = require('../src/singleton');

describe('I18n.singleton', () => {
  const definitions = {
    en: {
      foobar: 'foobar en',
      'items.none': 'No items.',
      'items.one': (p) => `1 item (${p.foobar}).`,
      'items.lots': (p) => `${p.n} items (${p.foobar}).`,
    },
    es: {
      foobar: 'foobar es',
      'items.none': 'Ningún artículo.',
      'items.one': (p) => `1 artículo (${p.foobar}).`,
      'items.lots': (p) => `${p.n} artículos (${p.foobar}).`,
    },
  };
  const qtyMap = {
    items: {
      0: 'items.none',
      1: 'items.one',
      _: 'items.lots',
    },
  };

  it('should fail if translation is called before initialization', () => {
    expect(() => i18n.translate('foobar')).to.throw(Error);
  });

  it('should fail if translation is called before setting the language', () => {
    i18n.addDefinitions(definitions, qtyMap);
    expect(() => i18n.translate('foobar')).to.throw(Error);
  });

  it('should work after initialization', () => {
    i18n.setLanguage('en');
    expect(i18n.translate('foobar')).to.equal('foobar en');
  });

  it('should accept aliases t and n', () => {
    expect(i18n.t('foobar')).to.equal(i18n.translate('foobar'));
    expect(i18n.n(0, 'items')).to.equal(i18n.n(0, 'items'));
  });
});
