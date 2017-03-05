/* global describe, it, expect, jest */

import fs from 'fs';
import * as mkdirp from 'mkdirp';

import transformOpenl10n, { readYml } from '../src';

describe('openl10n-to-bazinga-translator', () => {
  it('can read a yaml file', () => {
    expect(readYml('./test/yml/example.en.yml')).toEqual({
      locale: 'en',
      domain: 'example',
      translations: {
        about: 'about',
        'at.shortdate.hour.format': 'at %formatted_date%',
        today: 'today',
      },
    });
  });

  it('can dump to a json file', () => {
    fs.writeFile = jest.fn();
    mkdirp.default = jest.fn();

    transformOpenl10n('web/js', 'test/yml')
     .then(() => {
       expect(fs.writeFile.mock.calls).toEqual([
         [
           'web/js/example/en.json',
           {
             translations: {
               en: {
                 messages: {
                   about: 'about',
                   'at.shortdate.hour.format': 'at %formatted_date%',
                   today: 'today',
                 },
               },
             },
           },
         ],
         [
           'web/js/example/fr.json',
           {
             translations: {
               fr: {
                 messages: {
                   about: 'En savoir plus',
                   'at.shortdate.hour.format': 'à %formatted_date%',
                   today: 'Aujourd\'hui',
                 },
               },
             },
           },
         ],
       ]);
     });
  });

  it('can dump to a js file', () => {
    fs.writeFile = jest.fn();
    mkdirp.default = jest.fn();

    transformOpenl10n('web/js', 'test/yml', 'js')
     .then(() => {
       expect(fs.writeFile.mock.calls).toEqual([
         [
           'web/js/example/en.js',
           '(function (Translator) {Translator.add("about", "about", "example", "en");Translator.add("at.shortdate.hour.format", "at %formatted_date%", "example", "en");Translator.add("today", "today", "example", "en");})(Translator);',
         ],
         [
           'web/js/example/fr.js',
           '(function (Translator) {Translator.add("about", "En savoir plus", "example", "fr");Translator.add("at.shortdate.hour.format", "à %formatted_date%", "example", "fr");Translator.add("today", "Aujourd\'hui", "example", "fr");})(Translator);',
         ],

       ]);
     });
  });
});
