function formatJs(translationList, locale, domain) {
  const translatorCalls = Object.keys(translationList).map((translationKey) => {
    const translation = translationList[translationKey];
    return `Translator.add(${JSON.stringify(translationKey)}, ${JSON.stringify(translation)}, "${domain}", "${locale}");`;
  });

  return `(function (Translator) {${translatorCalls.join('')}})(Translator);`;
}

function formatJson(translationList, locale, domain) {
  return JSON.stringify({
    translations: {
      [locale]: {
        [domain]: translationList,
      },
    },
  });
}

function formatTranslationList(translationList, locale, domain, format) {
  switch (format) {
    case 'js':
      return formatJs(translationList, locale, domain);
    case 'json':
      return formatJson(translationList, locale, domain);
    default:
      throw new Error(`No formatting for format ${format}`);
  }
}

export default formatTranslationList;
