class I18n {
  /**
   * Creates an instance of I18n.
   *
   * @param {String} lang          Active language at the beginning
   * @param {Object} [definitions] If specified, `addDefinitions` will be called when constructing the object
   */
  constructor(lang, definitions) {
    this.texts = {};

    if (definitions) {
      this.addDefinitions(definitions);
    }

    this.setLanguage(lang);
  }

  /**
   * @returns {String[]} list of the available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.texts);
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
   */
  addDefinitions(definitions) {
    Object.keys(definitions).forEach((lang) => {
      lang = lang.toLowerCase();
      const rawTranslations = definitions[lang];
      const translations = this.texts[lang] || {};
      Object.keys(translations).forEach((key) => {
        translations[key.toLowerCase()] = rawTranslations[key];
      });
      this.texts[lang] = translations;
    });
    this.availableLanguages.sort();
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
}

module.exports = I18n;
