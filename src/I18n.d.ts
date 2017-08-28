declare class I18n {
  constructor(lang:string, definitions?:I18nDefinitions, qtyMap?:QtyMap);
  getAvailableLanguages():Array<string>;
  getLanguage():string;
  setLanguage(lang:string):void;
  addDefinitions(definitions:I18nDefinitions, qtyMap?:QtyMap):void;
  translate(id:string, params?:any);
  translateN(n:number, id:string, params?:any);
}

export default I18n;

type I18nTranslation = string | { (any): string };

interface I18nTranslations {
  [textId:string]: I18nTranslation,
}

interface I18nDefinitions {
  [language:string]: I18nTranslations,
}

interface QtyDefinition {
  _?: string,
  [qty:number]: string,
}

interface QtyMap {
  [textId:string]: QtyDefinition,
}
