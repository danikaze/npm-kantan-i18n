var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var I18n = function () {
  /**
   * Creates an instance of I18n.
   *
   * @param {String} [lang]        Active language at the beginning.
   *                               If not specified, `setLanguage` will need to be called before translating anything.
   * @param {Object} [definitions] If specified, `addDefinitions` will be called when constructing the object.
   * @param {Object} [qtyMap]      Quantity map used to resolve the translation to use when using `translateN`.
   *                               Object as `{ id: { qty: id } }`
   */
  function I18n(lang, definitions, qtyMap) {
    _classCallCheck(this, I18n);

    this.texts = {};
    this.qtyMap = {};

    if (definitions) {
      this.addDefinitions(definitions, qtyMap);
    }

    if (lang) {
      this.setLanguage(lang);
    }
  }

  /**
   * @returns {String[]} list of the available languages
   */


  I18n.prototype.getAvailableLanguages = function getAvailableLanguages() {
    return Object.keys(this.texts).filter(function (lang) {
      return lang !== 'nMap';
    });
  };

  /**
   * @returns {String} Code of the current active language
   */


  I18n.prototype.getLanguage = function getLanguage() {
    return this.currentLang;
  };

  /**
   * Set the current language
   *
   * @param {String} newLanguage Code of the language to set (case insensitive)
   */


  I18n.prototype.setLanguage = function setLanguage(lang) {
    lang = lang.toLowerCase();
    this.currentTexts = this.texts[lang];
    if (!this.currentTexts) {
      this.texts[lang] = {};
      this.currentTexts = this.texts[lang];
    }
    this.currentLang = lang;
  };

  /**
   * Add a list of text definitions
   *
   * @param {Object} definitions Map of texts as `{ languageCode: translations }`, being `translations` as
   *                             `{ id: text }` or `{ id: function(params) => text }`
   *                             Both `languageCode` and `id` are case insensitive
   * @param {Object} [qtyMap]    Quantity map used to resolve the translation to use when using `translateN`.
   *                             Object as `{ id: { qty: id } }`
   */


  I18n.prototype.addDefinitions = function addDefinitions(definitions, qtyMap) {
    var _this = this;

    Object.keys(definitions).forEach(function (lang) {
      lang = lang.toLowerCase();
      var rawTranslations = definitions[lang];
      var translations = _this.texts[lang] || {};
      Object.keys(rawTranslations).forEach(function (key) {
        translations[key.toLowerCase()] = rawTranslations[key];
      });
      _this.texts[lang] = translations;
    });

    if (!qtyMap) {
      return;
    }

    Object.keys(qtyMap).forEach(function (id) {
      _this.qtyMap[id.toLowerCase()] = qtyMap[id];
    });
  };

  /**
   * Get the translation of a text in the active language.
   *
   * @param   {String} id       ID of the requested text (case insensitive)
   * @param   {Object} [params] Params as { key: value } to replace, if needed
   * @returns {String}          Translated text or `id` if not found
   *
   * @example
   * const i18n = new I18n('en', {
   *   en: {
   *    simple: 'this is a simple text',
   *    greeting: (p) => `hello ${p.name}`
   *   },
   *   es: {
   *    simple: `esto es un texto sencillo`,
   *    greeting: (p) => `hola ${p.name}`
   *   },
   * });
   *
   * const _ = i18n.translate.bind(i18n);
   * _('simple');                      // 'this is a simple text'
   * _('greeting', { name: 'world' }); // 'hello world!'
   */


  I18n.prototype.translate = function translate(id, params) {
    var text = this.currentTexts[id.toLowerCase()];
    if (!text) {
      return '' + id;
    }

    if (typeof text === 'function') {
      text = text(params);
    }

    return text;
  };

  /**
   * Get the translation of a text in the active language, depending on a quantity.
   *
   * @param {Number} n      Quantity used to decide the translation
   * @param {String} id     ID of the _quantity map_ which will be used to get the definitions
   *                        This _quantity map_ should be defined in the `qtyMap` parameter of the constructor
   * @param {Object} params Params as { key: value } to replace, if needed.
   *                        `n` will always be added as a parameter, but it can be overwritten if specified.
   * @returns {String}      Translated text or `id` if not found
    * @example
   * const definitions = {
   *   en: {
   *     none: 'No items.',
   *     one: (p) => `1 item (${p.foobar}).`,
   *     lots: (p) => `${p.n} items (${p.foobar})`,
   *   },
   * };
   * const qtyMap = {
   *   items: {
   *     0: 'none',
   *     1: 'one',
   *     _: 'lots',
   *   },
   * }
   * const i18n = new I18n('en', definitions, qtyMap);
   *
   * i18n.translateN(0, 'items');      // 'No items.'
   * i18n.translateN(1, 'items', '^'); // '1 item (^).'
   * i18n.translateN(5, 'items', '*'); // '5 items (*).'
   */


  I18n.prototype.translateN = function translateN(n, id, params) {
    id = this.qtyMap[id.toLowerCase()];
    id = id[n] || id._;
    params = params ? _extends({ n: n }, params) : { n: n };

    return this.translate(id, params);
  };

  return I18n;
}();

module.exports = I18n;