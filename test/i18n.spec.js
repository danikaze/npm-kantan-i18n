const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const I18n = require('../src/I18n');

describe('I18n', () => {
  it('should fail if translation is called with no languages', () => {
    const i18n = new I18n();
    expect(() => i18n.translate('foobar')).to.throw(Error);
  });

  it('should add definitions if specified in the constructor', () => {
    const i18n = new I18n('en', {
      en: { foo: 'foo translation' },
    });

    expect(i18n.translate('foo')).to.equal('foo translation');
  });

  it('should return the ID if translation is not found', () => {
    const i18n = new I18n('en');
    const text = i18n.translate('foobar');
    const text2 = i18n.translate('FooBar');

    expect(text).to.equal('foobar');
    expect(text2).to.equal('FooBar');
  });

  it('should treat IDs as case insensitive', () => {
    const i18n = new I18n('en', {
      en: {
        foo: 'foo translation',
        bar: 'bar translation',
        fooBar: 'fooBar translation',
      },
    });

    expect(i18n.translate('foo')).to.equal('foo translation');
    expect(i18n.translate('Foo')).to.equal('foo translation');
    expect(i18n.translate('FOO')).to.equal('foo translation');
  });

  it('should return the list of available languages', () => {
    const i18n = new I18n('en', {
      en: { foo: 'foo en' },
      es: { foo: 'foo es' },
      ja: { foo: 'foo ja' },
    });

    expect(i18n.getAvailableLanguages()).to.have.members(['en', 'es', 'ja']);
  });

  it('should allow add more definitions', () => {
    const i18n = new I18n('en');

    expect(i18n.translate('foo')).to.equal('foo');

    i18n.addDefinitions({
      en: { foo: 'foo translation' },
    });

    expect(i18n.translate('foo')).to.equal('foo translation');
  });

  it('should switch language properly (case insensitive)', () => {
    const i18n = new I18n('en', {
      en: { foo: 'foo en' },
      es: { foo: 'foo es' },
      ja: { foo: 'foo ja' },
    });

    expect(i18n.getLanguage()).to.equal('en');
    expect(i18n.translate('foo')).to.equal('foo en');
    i18n.setLanguage('es');
    expect(i18n.getLanguage()).to.equal('es');
    expect(i18n.translate('foo')).to.equal('foo es');
    i18n.setLanguage('ja');
    expect(i18n.getLanguage()).to.equal('ja');
    expect(i18n.translate('foo')).to.equal('foo ja');
    i18n.setLanguage('EN');
    expect(i18n.getLanguage()).to.equal('en');
    expect(i18n.translate('foo')).to.equal('foo en');
  });

  it('should accept parameters in translations', () => {
    const i18n = new I18n('en', {
      en: { foo: (p) => `params: ${p.p1}, ${p.p2}` },
    });
    const p1 = 'abc';
    const p2 = '123';
    const text = i18n.translate('foo', { p1, p2 });

    expect(text).to.be.equal('params: abc, 123');
  });

  it('should manage quantities in translations', () => {
    const definitions = {
      en: {
        'items.none': 'No items.',
        'items.one': (p) => `1 item (${p.foobar}).`,
        'items.lots': (p) => `${p.n} items (${p.foobar}).`,
      },
    };
    const qtyMap = {
      items: {
        0: 'items.none',
        1: 'items.one',
        _: 'items.lots',
      },
    };
    const i18n = new I18n('en', definitions, qtyMap);

    expect(i18n.translateN(0, 'items')).to.equal('No items.');
    expect(i18n.translateN(1, 'items', { foobar: '^' })).to.equal('1 item (^).');
    expect(i18n.translateN(5, 'items', { foobar: '*' })).to.equal('5 items (*).');
  });
});
