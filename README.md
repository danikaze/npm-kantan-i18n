# kantan-i18n

Really simple internationalization system.

Check the [API documentation here](docs/README.md).

## Install

```
npm install --save kantan-i18n
```

or
```
yarn add kantan-i18n
```

## Usage

```js
const I18n = require('kantan-i18n');

// English translations for your texts
// You probably want to load this from a different file
const definitionsEN = {
  simple: 'This is a simple text',
  complex: (p) => `This text accept parameters (foo: ${p.foo} and bar: ${p.bar})`,
  'items.none': 'No items.',
  'items.one': (p) => `1 item (${p.foobar}).`,
  'items.lots': (p) => `${p.n} items (${p.foobar}).`,
};

// Spanish translations for your texts
// You probably want to load this from a different file, only when required
const definitionsES = {
  simple: 'Esto es un texto sencillo',
  complex: (p) => `Este texto acepta parámetros (foo: ${p.foo} y bar: ${p.bar})`,
  'items.none': 'Ningún artículo.',
  'items.one': (p) => `1 artículo (${p.foobar}).`,
  'items.lots': (p) => `${p.n} artículos (${p.foobar}).`,
};

// Japanese translations for your texts
// You probably want to load this from a different file, only when required
const definitionsJA = {
  simple: 'これは簡単な文言です',
  complex: (p) => `この分で、パラーメタを使うことができます (foo: ${p.foo} と bar: ${p.bar})`,
  'items.none': '商品なし.',
  'items.one': (p) => `商品一つ (${p.foobar}).`,
  'items.lots': (p) => `商品${p.n}つ (${p.foobar}).`,
};

// This is your quantity map. It should be shared between all your translations
const qtyMap = {
  items: {
    0: 'items.none',  // items.none will be used when calling items with n = 0
    1: 'items.one',   // items.one will be used when calling items with n = 1
    _: 'items.lots',  // items.lots will be used when calling items with any other value
  },
}

// i18n object is initialized here with EN and ES translations
const i18n = new I18n('en', {
  en: definitionsEN,
  es: definitionsES,
}, qtyMap);

// let's get simple text in English:
const text = i18n.translate('simple');
// text = 'This is a simple text'

// let's get complex text in Spanish:
i18n.setLanguage('es');
const complex = i18n.translate('complex', { foo: 123, bar: 'abc' });
// complex = 'Este texto acepta parámetros (foo: 123 y bar: abc)'

// let's load Japanese translations and get a quantity dependant one
i18n.addDefinitions({ ja: definitionsJA });
i18n.setLanguage('ja');
const qty = i18n.translateN(3, 'items', { foobar: '*#^#*' });
// qty = '商品3つ (*#^#*).'
```

You can also define an alias to avoid writing `i18n.translate` all the time:

```js
const _ = i18n.translate.bind(i18n);
const _n = i18n.translateN.bind(i18n);

i18n.setLanguage('en');
_('simple');                          // This is a simple text
_n(0, 'items', { foobar: '*#^#*' });  // No items.
```
