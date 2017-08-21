<a name="i18n"></a>

## i18n
This module provides a singleton instance of I18n which will be persistent in the application lifetime
at module level.

If used, it needs to be initialized in this order before calling to anything:
1. `addDefinitions`
2. `setLanguage`

Note that `addDefinitions` can be called several times, even after calling `setLanguage`
(i.e. to load more translations dynamically)

**Kind**: global constant  

* * *

