const I18n = require('./I18n');

/*
* This module provides a singleton instance of I18n which will be persistent in the application lifetime
* at module level.
*
* If used, it needs to be initialized in this order before calling to anything:
* 1. `addDefinitions`
* 2. `setLanguage`
*
* Note that `addDefinitions` can be called several times, even after calling `setLanguage`
* (i.e. to load more translations dynamically)
*/

const i18n = new I18n();
module.exports = {
  getAvailableLanguages: i18n.getAvailableLanguages.bind(i18n),
  getLanguage: i18n.getLanguage.bind(i18n),
  setLanguage: i18n.setLanguage.bind(i18n),
  addDefinitions: i18n.addDefinitions.bind(i18n),
  translate: i18n.translate.bind(i18n),
  translateN: i18n.translateN.bind(i18n),
  t: i18n.translate.bind(i18n),
  n: i18n.translateN.bind(i18n),
};
