class I18n {
  /**
   * Creates an instance of I18n.
   *
   * @param {String} [lang]        Active language at the beginning.
   *                               If not specified, `setLanguage` will need to be called before translating anything.
   * @param {Object} [definitions] If specified, `addDefinitions` will be called when constructing the object.
   * @param {Object} [qtyMap]      Quantity map used to resolve the translation to use when using `translateN`.
   *                               Object as `{ id: { qty: id } }`
   */
  constructor(lang, definitions, qtyMap) {
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
  getAvailableLanguages() {
    return Object.keys(this.texts).filter((lang) => lang !== 'nMap');
  }

  /**
   * @returns {String} Code of the current active language
   */
  getLanguage() {
    return this.currentLang;
  }

  /**
   * Set the current language
   *
   * @param {String} newLanguage Code of the language to set (case insensitive)
   */
  setLanguage(lang) {
    lang = lang.toLowerCase();
    this.currentTexts = this.texts[lang];
    if (!this.currentTexts) {
      this.texts[lang] = {};
      this.currentTexts = this.texts[lang];
    }
    this.currentLang = lang;
  }

  /**
   * Add a list of text definitions
   *
   * @param {Object} definitions Map of texts as `{ languageCode: translations }`, being `translations` as
   *                             `{ id: text }` or `{ id: function(params) => text }`
   *                             Both `languageCode` and `id` are case insensitive
   * @param {Object} [qtyMap]    Quantity map used to resolve the translation to use when using `translateN`.
   *                             Object as `{ id: { qty: id } }`
   */
  addDefinitions(definitions, qtyMap) {
    Object.keys(definitions).forEach((lang) => {
      lang = lang.toLowerCase();
      const rawTranslations = definitions[lang];
      const translations = this.texts[lang] || {};
      Object.keys(rawTranslations).forEach((key) => {
        translations[key.toLowerCase()] = rawTranslations[key];
      });
      this.texts[lang] = translations;
    });

    if (!qtyMap) {
      return;
    }

    Object.keys(qtyMap).forEach((id) => {
      this.qtyMap[id.toLowerCase()] = qtyMap[id];
    });
  }

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
  translate(id, params) {
    let text = this.currentTexts[id.toLowerCase()];
    if (!text) {
      return `${id}`;
    }

    if (typeof text === 'function') {
      text = text(params);
    }

    return text;
  }

  /**
   * Get the translation of a text in the active language, depending on a quantity.
   *
   * @param {Number} n      Quantity used to decide the translation via `map`
   * @param {String} map    ID of the _quantity map_ which will be used to get the definitions from `nMap`
   *                        This _quantity map_ should be defined in the `qtyMap` parameter of the constructor
   * @param {Object} params Params as { key: value } to replace, if needed.
   *                        `n` will always be added as a parameter, but it can be overwritten if specified.
   *
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
  translateN(n, id, params) {
    id = this.qtyMap[id.toLowerCase()];
    id = id[n] || id._;
    params = params ? Object.assign({ n }, params) : { n };

    return this.translate(id, params);
  }
}

module.exports = I18n;
