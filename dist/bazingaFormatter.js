'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function formatJs(translationList, locale, domain) {
  var translatorCalls = Object.keys(translationList).map(function (translationKey) {
    var translation = translationList[translationKey];
    return 'Translator.add(' + JSON.stringify(translationKey) + ', ' + JSON.stringify(translation) + ', "' + domain + '", "' + locale + '");';
  });

  return '(function (Translator) {' + translatorCalls.join('') + '})(Translator);';
}

function formatJson(translationList, locale, domain) {
  return JSON.stringify({
    translations: _defineProperty({}, locale, _defineProperty({}, domain, translationList))
  });
}

function formatTranslationList(translationList, locale, domain, format) {
  switch (format) {
    case 'js':
      return formatJs(translationList, locale, domain);
    case 'json':
      return formatJson(translationList, locale, domain);
    default:
      throw new Error('No formatting for format ' + format);
  }
}

exports.default = formatTranslationList;